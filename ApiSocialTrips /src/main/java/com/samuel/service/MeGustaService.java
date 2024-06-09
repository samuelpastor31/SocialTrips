package com.samuel.service;

import com.samuel.modelo.MeGusta;
import com.samuel.modelo.Usuarios;
import com.samuel.modeloDTO.MeGustaDTO;
import com.samuel.modeloDTO.UsuariosDTO;
import com.samuel.repository.MeGustaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MeGustaService {

    @Autowired
    private MeGustaRepository meGustaRepository;

    public List<MeGusta> findAll() {
        return meGustaRepository.findAll();
    }

    public Optional<MeGusta> findById(int id) {
        return meGustaRepository.findById(id);
    }

    public MeGusta save(MeGusta meGusta) {
        return meGustaRepository.save(meGusta);
    }

    public void deleteById(int id) {
        meGustaRepository.deleteById(id);
    }
    
    public List<MeGustaDTO> obtenerTodosDTO() {
        List<MeGusta> usuarios = meGustaRepository.findAll();
        return convertirAMeGustaDTO(usuarios);
    }
    
    private List<MeGustaDTO> convertirAMeGustaDTO(List<MeGusta> meGustas) {
        List<MeGustaDTO> meGustasDTO = new ArrayList<>();
        for (MeGusta meGusta : meGustas) {
            MeGustaDTO meGustaDTO = new MeGustaDTO();
            meGustaDTO.setId(meGusta.getId());
            meGustaDTO.setIdItinerario(meGusta.getItinerarios().getId());
            meGustaDTO.setIdUsuario(meGusta.getUsuarios().getId());
            meGustasDTO.add(meGustaDTO);
        }
        return meGustasDTO;
    }
    
    public MeGustaDTO convertirEntidadADTO(MeGusta meGusta) {
        MeGustaDTO meGustaDTO = new MeGustaDTO();
        meGustaDTO.setId(meGusta.getId());
        meGustaDTO.setIdItinerario(meGusta.getItinerarios().getId());
        meGustaDTO.setIdUsuario(meGusta.getUsuarios().getId());
        return meGustaDTO;
    }
    
    public List<MeGusta> findByUserIdAndItineraryId(int userId, int itineraryId) {
        return meGustaRepository.findByUsuariosIdAndItinerariosId(userId, itineraryId);
    }

}
