package com.recordis.api_recordis.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "usuarios")
public class Usuario {

    @Id
    private String id;

    private String nombre;
    private int edad;
    private String avatar;
    private String color;
    private String genero;
    private String foto;
}
