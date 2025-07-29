package tec.edu.azuay.shortbank.persistence.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRequest implements Serializable {

    private String name;

    private String lastName;

    private String email;

    private String password;
}
