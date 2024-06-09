package com.samuel.service;

import com.samuel.modelo.Itinerarios;
import com.samuel.modelo.Usuarios;
import com.samuel.modeloDTO.ItinerariosDTO;
import com.samuel.repository.ItinerariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ItinerariosService {

    @Autowired
    private ItinerariosRepository itinerariosRepository;
    
    @Autowired
    private ComentariosService comentariosService;

    public List<ItinerariosDTO> findAll() {
        return itinerariosRepository.findAll().stream().map(Itinerarios::toDTO).collect(Collectors.toList());
    }

    public Optional<ItinerariosDTO> findById(int id) {
        return itinerariosRepository.findById(id).map(Itinerarios::toDTO);
    }

    public Itinerarios save(Itinerarios itinerarios) {
        return itinerariosRepository.save(itinerarios);
    }

    public void deleteById(int id) {
        itinerariosRepository.deleteById(id);
    }

    public List<ItinerariosDTO> findByUsuarioId(int usuarioId) {
        return itinerariosRepository.findByUsuariosId(usuarioId).stream().map(Itinerarios::toDTO).collect(Collectors.toList());
    }
    
    public Itinerarios obtenerPorId(int id) {
        Optional<Itinerarios> usuariosOptional = itinerariosRepository.findById(id);
        return usuariosOptional.orElse(null);
    }
    
    public ItinerariosDTO convertirADTO(Itinerarios itinerarios) {
        ItinerariosDTO dto = new ItinerariosDTO();
        dto.setId(itinerarios.getId());
        dto.setIdUsuario(itinerarios.getUsuarios().getId());
        dto.setTitulo(itinerarios.getTitulo());
        dto.setDescripcion(itinerarios.getDescripcion());
        dto.setFechaCreacion(itinerarios.getFechaCreacion());
        dto.setDestino(itinerarios.getDestino());
        dto.setContadorMeGusta(itinerarios.getContadorMeGusta());
        dto.setComentario(itinerarios.getComentario());
        dto.setDuracion(itinerarios.getDuracion());
        dto.setComentarios(
            itinerarios.getComentarioses().stream()
                .map(comentariosService::convertirAComentariosDTO)
                .collect(Collectors.toList())
        );
        return dto;
    }
}