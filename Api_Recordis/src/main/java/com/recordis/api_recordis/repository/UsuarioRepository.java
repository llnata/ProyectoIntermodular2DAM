package com.recordis.api_recordis.repository;

import com.recordis.api_recordis.model.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UsuarioRepository extends MongoRepository<Usuario, String> {
}
