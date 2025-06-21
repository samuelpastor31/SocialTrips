package com.samuel.controller;

import com.samuel.modelo.Comentarios;
import com.samuel.modeloDTO.ComentariosDTO;
import com.samuel.service.ComentariosService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/comentarios")
public class ComentariosController {

    private final ComentariosService comentariosServicio;

    @Autowired
    public ComentariosController(ComentariosService comentariosServicio) {
        this.comentariosServicio = comentariosServicio;
    }

    @GetMapping
    public ResponseEntity<List<ComentariosDTO>> obtenerTodosComentarios() {
        List<ComentariosDTO> comentarios = comentariosServicio.obtenerTodos().stream()
                .map(comentariosServicio::convertirAComentariosDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(comentarios, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComentariosDTO> obtenerComentariosPorId(@PathVariable("id") int id) {
        Comentarios comentario = comentariosServicio.obtenerPorId(id);
        if (comentario != null) {
            ComentariosDTO comentarioDTO = comentariosServicio.convertirAComentariosDTO(comentario);
            return new ResponseEntity<>(comentarioDTO, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<ComentariosDTO> agregarComentarios(@RequestBody ComentariosDTO comentariosDTO) {
        try {
            ComentariosDTO nuevoComentario = comentariosServicio.crearComentario(comentariosDTO);
            return new ResponseEntity<>(nuevoComentario, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarComentarios(@PathVariable("id") int id) {
        comentariosServicio.eliminar(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/itinerario/{idItinerario}")
    public ResponseEntity<List<ComentariosDTO>> obtenerComentariosPorItinerario(@PathVariable int idItinerario) {
        List<ComentariosDTO> comentarios = comentariosServicio.obtenerTodos().stream()
                .filter(c -> c.getItinerarios().getId() == idItinerario)
                .map(comentariosServicio::convertirAComentariosDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(comentarios, HttpStatus.OK);
    }
}
