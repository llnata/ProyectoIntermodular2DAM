package com.recordis.api_recordis.controller;

import com.recordis.api_recordis.model.Usuario;
import com.recordis.api_recordis.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public List<Usuario> getAll() {
        return usuarioRepository.findAll();
    }

    @PostMapping
    public Usuario create(@RequestBody Usuario usuario) {
        Usuario guardado = usuarioRepository.save(usuario);
        System.out.println("GUARDADO USUARIO ID: " + guardado.getId());
        return guardado;
    }

    @PutMapping("/{id}")
    public Usuario update(@PathVariable String id, @RequestBody Usuario usuario) {
        usuario.setId(id);
        return usuarioRepository.save(usuario);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        usuarioRepository.deleteById(id);
    }
}

