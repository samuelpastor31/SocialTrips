package com.samuel.controller;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.samuel.modelo.Itinerarios;
import com.samuel.modelo.Usuarios;
import com.samuel.modeloDTO.ItinerariosDTO;
import com.samuel.service.ItinerariosService;
import com.samuel.service.UsuariosService;

@RestController
@RequestMapping("/itinerarios")
public class ItinerariosController {

    @Autowired
    private ItinerariosService itinerariosService;

    @Autowired
    private UsuariosService usuariosService;

    @GetMapping
    public List<ItinerariosDTO> getAllItinerarios() {
        return itinerariosService.findAll();
    }

    @PostMapping("/create")
    public ResponseEntity<ItinerariosDTO> createItinerario(@RequestBody ItinerariosDTO itinerariosDTO) {
        Itinerarios itinerario = new Itinerarios();
        itinerario.setTitulo(itinerariosDTO.getTitulo());
        itinerario.setDescripcion(itinerariosDTO.getDescripcion());
        itinerario.setDestino(itinerariosDTO.getDestino());
        itinerario.setFechaCreacion(new Date());
        itinerario.setContadorMeGusta(0);
        itinerario.setComentario(itinerariosDTO.getComentario());
        itinerario.setDuracion(itinerariosDTO.getDuracion());

        Usuarios usuario = usuariosService.obtenerPorId(itinerariosDTO.getIdUsuario());
        if (usuario == null) {
            return ResponseEntity.badRequest().build();
        }
        itinerario.setUsuarios(usuario);

        Itinerarios savedItinerario = itinerariosService.save(itinerario);
        return ResponseEntity.ok(savedItinerario.toDTO());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Itinerarios> updateItinerarios(@PathVariable int id, @RequestBody Itinerarios itinerariosDetails) {
        Optional<Itinerarios> itinerarios = itinerariosService.findById(id).map(dto -> {
            Itinerarios existingItinerarios = new Itinerarios();
            existingItinerarios.setId(dto.getId());
            existingItinerarios.setUsuarios(itinerariosDetails.getUsuarios());
            existingItinerarios.setTitulo(dto.getTitulo());
            existingItinerarios.setDescripcion(dto.getDescripcion());
            existingItinerarios.setFechaCreacion(dto.getFechaCreacion());
            existingItinerarios.setDestino(dto.getDestino());
            existingItinerarios.setContadorMeGusta(dto.getContadorMeGusta());
            existingItinerarios.setComentario(dto.getComentario());
            existingItinerarios.setDuracion(dto.getDuracion()); // Nuevo campo
            return existingItinerarios;
        });

        if (itinerarios.isPresent()) {
            Itinerarios updatedItinerarios = itinerariosService.save(itinerariosDetails);
            return ResponseEntity.ok(updatedItinerarios);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItinerarios(@PathVariable int id) {
        Optional<Itinerarios> itinerarios = itinerariosService.findById(id).map(dto -> {
            Itinerarios existingItinerarios = new Itinerarios();
            existingItinerarios.setId(dto.getId());
            existingItinerarios.setUsuarios(usuariosService.obtenerPorId(dto.getIdUsuario()));
            existingItinerarios.setTitulo(dto.getTitulo());
            existingItinerarios.setDescripcion(dto.getDescripcion());
            existingItinerarios.setFechaCreacion(dto.getFechaCreacion());
            existingItinerarios.setDestino(dto.getDestino());
            existingItinerarios.setContadorMeGusta(dto.getContadorMeGusta());
            existingItinerarios.setComentario(dto.getComentario());
            existingItinerarios.setDuracion(dto.getDuracion()); // Nuevo campo
            return existingItinerarios;
        });

        if (itinerarios.isPresent()) {
            itinerariosService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/by-usuario/{usuarioId}")
    public ResponseEntity<List<ItinerariosDTO>> getItinerariosByUsuarioId(@PathVariable int usuarioId) {
        List<ItinerariosDTO> itinerarios = itinerariosService.findByUsuarioId(usuarioId);
        return new ResponseEntity<>(itinerarios, HttpStatus.OK);
    }
}
