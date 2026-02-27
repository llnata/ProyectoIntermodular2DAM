package com.recordis.api_recordis.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "actividades")
public class Actividad {

    @Id
    private String id;

    private String titulo;
    private String descripcion;
    private String hora;
    private boolean completada;
    private String usuarioId;
    private String fecha;
}
