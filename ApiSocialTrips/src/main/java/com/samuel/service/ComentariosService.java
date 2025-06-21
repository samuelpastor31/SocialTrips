package com.samuel.service;

import com.samuel.modeloDTO.ComentariosDTO;
import com.samuel.modelo.Comentarios;
import com.samuel.modelo.Itinerarios;
import com.samuel.modelo.Usuarios;
import com.samuel.repository.ComentariosRepository;
import com.samuel.repository.ItinerariosRepository;
import com.samuel.repository.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ComentariosService {

    private final ComentariosRepository comentariosRepositorio;
    private final UsuariosRepository usuariosRepositorio;
    private final ItinerariosRepository itinerariosRepositorio;

    @Autowired
    public ComentariosService(ComentariosRepository comentariosRepositorio,
                              UsuariosRepository usuariosRepositorio,
                              ItinerariosRepository itinerariosRepositorio) {
        this.comentariosRepositorio = comentariosRepositorio;
        this.usuariosRepositorio = usuariosRepositorio;
        this.itinerariosRepositorio = itinerariosRepositorio;
    }

    public void deleteById(int id) {
        comentariosRepositorio.deleteById(id);
    }

    public List<Comentarios> obtenerTodos() {
        return comentariosRepositorio.findAll();
    }

    public Comentarios obtenerPorId(int id) {
        Optional<Comentarios> comentariosOptional = comentariosRepositorio.findById(id);
        return comentariosOptional.orElse(null);
    }

    public void guardarOActualizar(Comentarios comentariosDTO) {
        comentariosRepositorio.save(comentariosDTO);
    }

    public ComentariosDTO crearComentario(ComentariosDTO comentariosDTO) {
        Optional<Usuarios> usuarioOpt = usuariosRepositorio.findById(comentariosDTO.getIdUsuario());
        Optional<Itinerarios> itinerarioOpt = itinerariosRepositorio.findById(comentariosDTO.getIdItinerario());

        if (usuarioOpt.isPresent() && itinerarioOpt.isPresent()) {
            Comentarios comentarios = new Comentarios();
            comentarios.setUsuarios(usuarioOpt.get());
            comentarios.setItinerarios(itinerarioOpt.get());
            comentarios.setContenido(comentariosDTO.getContenido());
            comentarios.setFechaComentario(new Date());
            comentariosRepositorio.save(comentarios);
            return convertirAComentariosDTO(comentarios);
        } else {
            throw new RuntimeException("Usuario o Itinerario no encontrado");
        }
    }

    public ComentariosDTO convertirAComentariosDTO(Comentarios comentarios) {
        ComentariosDTO comentariosDTO = new ComentariosDTO();
        comentariosDTO.setId(comentarios.getId());
        comentariosDTO.setIdUsuario(comentarios.getUsuarios().getId());
        comentariosDTO.setIdItinerario(comentarios.getItinerarios().getId());
        comentariosDTO.setContenido(comentarios.getContenido());
        comentariosDTO.setFechaComentario(comentarios.getFechaComentario());

        // Obtener nombre de usuario
        String nombreUsuario = comentarios.getUsuarios().getNombreUsuario();
        comentariosDTO.setNombreUsuario(nombreUsuario);

        return comentariosDTO;
    }
    
    public Comentarios convertirADao(ComentariosDTO comentariosDTO) {
        Comentarios comentarios = new Comentarios();
        comentarios.setId(comentariosDTO.getId());

        Optional<Usuarios> usuarioOptional = usuariosRepositorio.findById(comentariosDTO.getIdUsuario());
        if (usuarioOptional.isPresent()) {
            comentarios.setUsuarios(usuarioOptional.get());
        } else {
            throw new RuntimeException("Usuario no encontrado");
        }

        Optional<Itinerarios> itinerarioOptional = itinerariosRepositorio.findById(comentariosDTO.getIdItinerario());
        if (itinerarioOptional.isPresent()) {
            comentarios.setItinerarios(itinerarioOptional.get());
        } else {
            throw new RuntimeException("Itinerario no encontrado");
        }

        comentarios.setContenido(comentariosDTO.getContenido());
        comentarios.setFechaComentario(comentariosDTO.getFechaComentario());

        return comentarios;
    }

    public void eliminar(int id) {
        Comentarios comentarioEliminar = obtenerPorId(id);
        comentariosRepositorio.delete(comentarioEliminar);
    }
}
