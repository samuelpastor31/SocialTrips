package com.samuel.controller;

import com.samuel.modelo.Itinerarios;
import com.samuel.modelo.MeGusta;
import com.samuel.modelo.Usuarios;
import com.samuel.modeloDTO.ItinerariosDTO;
import com.samuel.modeloDTO.MeGustaDTO;
import com.samuel.modeloDTO.UsuariosDTO;
import com.samuel.service.ItinerariosService;
import com.samuel.service.MeGustaService;
import com.samuel.service.UsuariosService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/megustas")
public class MeGustaController {

    @Autowired
    private MeGustaService meGustaService;
    
    @Autowired
    private ItinerariosService itinerariosService;
    
    @Autowired
    private UsuariosService usuariosService;
    
    @GetMapping
    public ResponseEntity<List<MeGustaDTO>> obtenerTodosUsuarios() {
        List<MeGustaDTO> meGustasDTO = meGustaService.obtenerTodosDTO();
        return new ResponseEntity<>(meGustasDTO, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MeGusta> getMeGustaById(@PathVariable int id) {
        Optional<MeGusta> meGusta = meGustaService.findById(id);
        if (meGusta.isPresent()) {
            return ResponseEntity.ok(meGusta.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<MeGusta> createMeGusta(@RequestBody MeGustaDTO meGustaDTO) {
    	
        Itinerarios itinerario = itinerariosService.obtenerPorId(meGustaDTO.getIdItinerario());

        // Obtener el usuario a partir del ID proporcionado
        Usuarios usuario = usuariosService.obtenerPorId(meGustaDTO.getIdUsuario());
        
        if (usuario == null) {
            return ResponseEntity.badRequest().build();
        }

        // Crear megusta
        MeGusta meGusta = new MeGusta(itinerario, usuario);
        itinerario.setContadorMeGusta(itinerario.getContadorMeGusta()+1);
        
        MeGusta savedMeGusta = meGustaService.save(meGusta);
        return ResponseEntity.ok(savedMeGusta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeGusta(@PathVariable int id) {
        Optional<MeGusta> meGustaOpt = meGustaService.findById(id);
        if (meGustaOpt.isPresent()) {
            MeGusta meGusta = meGustaOpt.get();
            int itinerarioId = meGusta.getItinerarios().getId();
            meGustaService.deleteById(id);

            Itinerarios itinerario = itinerariosService.obtenerPorId(itinerarioId);
            if (itinerario != null) {
                itinerario.setContadorMeGusta(itinerario.getContadorMeGusta() - 1);
                itinerariosService.save(itinerario);
            }

            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/find")
    public ResponseEntity<MeGustaDTO> findMeGusta(@RequestParam int userId, @RequestParam int itineraryId) {
    	
        List<MeGusta> meGustas = meGustaService.findByUserIdAndItineraryId(userId, itineraryId);
        if (!meGustas.isEmpty()) {
            MeGustaDTO meGustaDTO = meGustaService.convertirEntidadADTO(meGustas.get(0));
            return ResponseEntity.ok(meGustaDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }



}
