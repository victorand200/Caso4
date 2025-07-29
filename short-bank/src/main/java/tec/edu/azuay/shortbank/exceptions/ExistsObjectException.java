package tec.edu.azuay.shortbank.exceptions;

public class ExistsObjectException extends RuntimeException{

    public ExistsObjectException(){
        super("Object already exists");
    }
}
