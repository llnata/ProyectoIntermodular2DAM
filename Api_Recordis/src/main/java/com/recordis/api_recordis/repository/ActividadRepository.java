package com.recordis.api_recordis.repository;

import com.recordis.api_recordis.model.Actividad;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ActividadRepository extends MongoRepository<Actividad, String> {

    List<Actividad> findByUsuarioIdAndFecha(String usuarioId, String fecha);

    List<Actividad> findByUsuarioId(String usuarioId);
}
