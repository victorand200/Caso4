from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import tensorflow as tf
import joblib
import pandas as pd
import numpy as np
import os
from datetime import datetime
import logging
from werkzeug.exceptions import BadRequest
import json

# ==========================================
# CONFIGURACIÓN DE LA APLICACIÓN
# ==========================================

app = Flask(__name__)
CORS(app)

# Configuración de rate limiting
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)
limiter.init_app(app)

# Configuración de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('api.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# ==========================================
# CARGA DEL MODELO Y PREPROCESADORES
# ==========================================

class CarPricePredictor:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.label_encoders = None
        self.linear_model = None
        self.feature_columns = [
            'mileage_kmpl', 'engine_cc', 'owner_count', 'accidents_reported', 'vehicle_age',
            'fuel_type_encoded', 'brand_encoded', 'transmission_encoded', 
            'color_encoded', 'service_history_encoded', 'insurance_valid_encoded'
        ]
        self.categorical_features = [
            'fuel_type', 'brand', 'transmission', 'color', 'service_history', 'insurance_valid'
        ]
        self.load_models()
    
    def load_models(self):
        """Carga el modelo y preprocesadores"""
        try:
            # Cargar modelo de TensorFlow
            self.model = tf.keras.models.load_model('car_price_model.keras')
            logger.info("Modelo TensorFlow cargado exitosamente")
            
            # Cargar scaler
            self.scaler = joblib.load('scaler.pkl')
            logger.info("Scaler cargado exitosamente")
            
            # Cargar label encoders
            self.label_encoders = joblib.load('label_encoders.pkl')
            logger.info("Label encoders cargados exitosamente")

            self.linear_model = joblib.load('linear_regression_model.pkl')
            logger.info("Linear model cargado con éxito")
            
            logger.info("Todos los modelos cargados correctamente")
            
        except Exception as e:
            logger.error(f"Error cargando modelos: {str(e)}")
            raise Exception(f"Error al cargar modelos: {str(e)}")
    
    def validate_input(self, data):
        """Valida los datos de entrada"""
        required_fields = [
            'make_year', 'mileage_kmpl', 'engine_cc', 'fuel_type', 'owner_count',
            'brand', 'transmission', 'color', 'service_history', 'accidents_reported',
            'insurance_valid'
        ]
        
        # Verificar campos requeridos
        for field in required_fields:
            if field not in data:
                raise ValueError(f"Campo requerido faltante: {field}")
        
        # Validaciones específicas
        current_year = datetime.now().year
        if not (1980 <= data['make_year'] <= current_year):
            raise ValueError(f"Año de fabricación debe estar entre 1980 y {current_year}")
        
        if not (0 < data['mileage_kmpl'] <= 50):
            raise ValueError("Millaje debe estar entre 0 y 50 km/l")
        
        if not (500 <= data['engine_cc'] <= 8000):
            raise ValueError("Cilindrada debe estar entre 500 y 8000 cc")
        
        if not (1 <= data['owner_count'] <= 10):
            raise ValueError("Número de propietarios debe estar entre 1 y 10")
        
        if not (0 <= data['accidents_reported'] <= 10):
            raise ValueError("Número de accidentes debe estar entre 0 y 10")
        
        # Validar valores categóricos
        valid_values = {
            'fuel_type': ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
            'transmission': ['Manual', 'Automatic'],
            'service_history': ['Full', 'Partial', 'None'],
            'insurance_valid': ['Yes', 'No']
        }
        
        for field, valid_options in valid_values.items():
            if data[field] not in valid_options:
                raise ValueError(f"{field} debe ser uno de: {valid_options}")
        
        return True
    
    def preprocess_data(self, data):
        """Preprocesa los datos para la predicción"""
        # Crear DataFrame
        df = pd.DataFrame([data])
        
        # Crear edad del vehículo
        df['vehicle_age'] = datetime.now().year - df['make_year']
        
        # Codificar variables categóricas
        for feature in self.categorical_features:
            if feature in self.label_encoders:
                try:
                    df[feature + '_encoded'] = self.label_encoders[feature].transform(df[feature])
                except ValueError as e:
                    logger.warning(f"Valor no reconocido para {feature}: {data[feature]}")
                    # Usar el valor más común (0)
                    df[feature + '_encoded'] = 0
        
        # Seleccionar features
        X = df[self.feature_columns]
        
        # Normalizar
        X_scaled = self.scaler.transform(X)
        
        return X_scaled
    
    def predict_price(self, data):
        """Realiza la predicción del precio"""
        try:
            # Validar entrada
            self.validate_input(data)
            
            # Preprocesar datos
            X_processed = self.preprocess_data(data)
            
            # Realizar predicción
            prediction_keras = self.model.predict(X_processed, verbose=0)[0][0]

            prediction_linear = self.linear_model.predict(X_processed)[0]
            
            # Asegurar precio mínimo
            keras_price = max(float(prediction_keras), 1000.0)

            linear_price = max(float(prediction_linear), 1000.0)
            
            return {
                "keras": keras_price,
                "linear": linear_price
            }
            
        except Exception as e:
            logger.error(f"Error en predicción: {str(e)}")
            raise

# Inicializar predictor
predictor = CarPricePredictor()

# ==========================================
# RUTAS DE LA API
# ==========================================

@app.route('/', methods=['GET'])
def home():
    """Ruta de inicio con información de la API"""
    return jsonify({
        'message': 'API de Predicción de Precios de Autos Usados',
        'version': '1.0.0',
        'status': 'active',
        'endpoints': {
            'predict': '/predict - POST',
            'health': '/health - GET',
            'model_info': '/model-info - GET'
        },
        'documentation': 'Envía datos del vehículo a /predict para obtener el precio estimado'
    })

@app.route('/health', methods=['GET'])
def health_check():
    """Verificación de salud de la API"""
    try:
        # Verificar que el modelo esté cargado
        if predictor.model is None:
            return jsonify({'status': 'error', 'message': 'Modelo no cargado'}), 500
        
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.now().isoformat(),
            'model_loaded': True,
            'version': '1.0.0'
        })
    except Exception as e:
        logger.error(f"Error en health check: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/model-info', methods=['GET'])
def model_info():
    """Información sobre el modelo"""
    return jsonify({
        'model_type': 'TensorFlow Neural Network',
        'purpose': 'Predicción de precios de autos usados',
        'features': predictor.feature_columns,
        'categorical_features': predictor.categorical_features,
        'valid_values': {
            'fuel_type': ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
            'transmission': ['Manual', 'Automatic'],
            'service_history': ['Full', 'Partial', 'None'],
            'insurance_valid': ['Yes', 'No']
        },
        'ranges': {
            'make_year': '1980-2025',
            'mileage_kmpl': '0-50',
            'engine_cc': '500-8000',
            'owner_count': '1-10',
            'accidents_reported': '0-10'
        }
    })

@app.route('/predict', methods=['POST'])
@limiter.limit("10 per minute")
def predict():
    """Endpoint principal para predicción de precios"""
    try:
        # Verificar que se envió JSON
        if not request.is_json:
            return jsonify({'error': 'Content-Type debe ser application/json'}), 400
        
        data = request.get_json()
        
        # Log de la petición
        logger.info(f"Petición de predicción recibida: {data}")
        
        # Realizar predicción
        predicted_price = predictor.predict_price(data)
        
        # Crear respuesta
        response = {
            'success': True,
            'predicted_price_usd_with_keras': round(predicted_price["keras"], 2),
            'predicted_price_usd_with_linear': round(predicted_price["linear"], 2),
            'input_data': data,
            'timestamp': datetime.now().isoformat(),
            'model_version': '1.0.0'
        }
        
        return jsonify(response), 200
        
    except ValueError as e:
        logger.warning(f"Error de validación: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Datos de entrada inválidos',
            'message': str(e)
        }), 400
    
    except Exception as e:
        logger.error(f"Error interno: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Error interno del servidor',
            'message': 'Ocurrió un error procesando la solicitud'
        }), 500

@app.route('/predict-batch', methods=['POST'])
@limiter.limit("5 per minute")
def predict_batch():
    """Endpoint para predicción en lote"""
    try:
        if not request.is_json:
            return jsonify({'error': 'Content-Type debe ser application/json'}), 400
        
        data = request.get_json()
        
        # Verificar que se envió una lista
        if not isinstance(data, list):
            return jsonify({'error': 'Se esperaba una lista de objetos'}), 400
        
        # Limitar número de predicciones en lote
        if len(data) > 100:
            return jsonify({'error': 'Máximo 100 predicciones por lote'}), 400
        
        results = []
        
        for i, item in enumerate(data):
            try:
                predicted_price = predictor.predict_price(item)
                results.append({
                    'index': i,
                    'success': True,
                    'predicted_price_usd_keras': round(predicted_price["keras"], 2),
                    'predicted_price_usd_linear': round(predicted_price["linear"], 2),
                    'input_data': item
                })
            except Exception as e:
                results.append({
                    'index': i,
                    'success': False,
                    'error': str(e),
                    'input_data': item
                })
        
        return jsonify({
            'success': True,
            'results': results,
            'total_predictions': len(data),
            'timestamp': datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        logger.error(f"Error en predicción en lote: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Error interno del servidor',
            'message': str(e)
        }), 500

# ==========================================
# MANEJO DE ERRORES
# ==========================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint no encontrado',
        'message': 'La ruta solicitada no existe'
    }), 404

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({
        'success': False,
        'error': 'Método no permitido',
        'message': 'El método HTTP no está permitido para esta ruta'
    }), 405

@app.errorhandler(429)
def rate_limit_handler(e):
    return jsonify({
        'success': False,
        'error': 'Límite de velocidad excedido',
        'message': 'Demasiadas peticiones. Intenta de nuevo más tarde.'
    }), 429

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Error interno: {str(error)}")
    return jsonify({
        'success': False,
        'error': 'Error interno del servidor',
        'message': 'Ocurrió un error interno'
    }), 500

# ==========================================
# CONFIGURACIÓN PARA PRODUCCIÓN
# ==========================================

if __name__ == '__main__':
    # Verificar que existan los archivos del modelo
    required_files = ['car_price_model.keras', 'scaler.pkl', 'label_encoders.pkl']
    missing_files = [f for f in required_files if not os.path.exists(f)]
    
    if missing_files:
        logger.error(f"Archivos faltantes: {missing_files}")
        print(f"❌ Error: Archivos faltantes: {missing_files}")
        print("📋 Asegúrate de tener los siguientes archivos en el directorio:")
        for file in required_files:
            print(f"   - {file}")
        exit(1)
    
    logger.info("Iniciando servidor Flask...")
    print("🚀 Iniciando API de Predicción de Precios de Autos Usados")
    print("📡 Servidor corriendo en: http://localhost:5000")
    print("📋 Endpoints disponibles:")
    print("   - GET  /              - Información de la API")
    print("   - GET  /health        - Estado de la API")
    print("   - GET  /model-info    - Información del modelo")
    print("   - POST /predict       - Predicción individual")
    print("   - POST /predict-batch - Predicción en lote")
    
    # Configuración para desarrollo
    app.run(debug=True, host='0.0.0.0', port=5000)
    
    # Para producción, usar un servidor WSGI como Gunicorn:
    # gunicorn -w 4 -b 0.0.0.0:5000 app:app