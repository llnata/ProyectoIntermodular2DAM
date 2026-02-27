package com.recordis.api_recordis.controller;

import com.recordis.api_recordis.model.Actividad;
import com.recordis.api_recordis.repository.ActividadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/actividades")   // <-- quitamos /api
@CrossOrigin(origins = "*")
public class ActividadController {

    @Autowired
    private ActividadRepository actividadRepository;

    @GetMapping
    public List<Actividad> getAll(
            @RequestParam(required = false) String usuarioId,
            @RequestParam(required = false) String fecha) {

        if (usuarioId != null && fecha != null) {
            return actividadRepository.findByUsuarioIdAndFecha(usuarioId, fecha);
        } else if (usuarioId != null) {
            return actividadRepository.findByUsuarioId(usuarioId);
        }
        return actividadRepository.findAll();
    }

    @PostMapping
    public Actividad create(@RequestBody Actividad actividad) {
        return actividadRepository.save(actividad);
    }

    @PutMapping("/{id}")
    public Actividad update(@PathVariable String id, @RequestBody Actividad incoming) {
        Actividad existente = actividadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Actividad no encontrada"));

        existente.setTitulo(incoming.getTitulo());
        existente.setDescripcion(incoming.getDescripcion());
        existente.setHora(incoming.getHora());
        existente.setCompletada(incoming.isCompletada());
        existente.setUsuarioId(incoming.getUsuarioId());
        existente.setFecha(incoming.getFecha());

        return actividadRepository.save(existente);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        actividadRepository.deleteById(id);
    }
}
