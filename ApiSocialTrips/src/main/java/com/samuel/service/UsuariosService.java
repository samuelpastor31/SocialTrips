package com.samuel.service;

import com.samuel.modelo.Usuarios;

import com.samuel.modeloDTO.UsuariosDTO;
import com.samuel.repository.UsuariosRepository;
import com.samuel.utils.Utilities;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class UsuariosService {

    private final UsuariosRepository usuariosRepositorio;

    public UsuariosService(UsuariosRepository usuariosRepositorio) {
        this.usuariosRepositorio = usuariosRepositorio;
    }

    public List<Usuarios> obtenerTodos() {
        return usuariosRepositorio.findAll();
    }
    
    public List<UsuariosDTO> obtenerTodosDTO() {
        List<Usuarios> usuarios = usuariosRepositorio.findAll();
        return convertirAUsuariosDTO(usuarios);
    }

    public Usuarios obtenerPorId(int id) {
        Optional<Usuarios> usuariosOptional = usuariosRepositorio.findById(id);
        return usuariosOptional.orElse(null);
    }

    public void eliminar(int id) {
        usuariosRepositorio.deleteById(id);
    }
    
    public UsuariosDTO obtenerPorNombreDTO(String nombreUsuario) {
        return usuariosRepositorio.findByNombreDTO(nombreUsuario);
    }
    
    public Usuarios obtenerPorNombre(String nombreUsuario) {
        return usuariosRepositorio.findByNombre(nombreUsuario);
    }
    
    private List<UsuariosDTO> convertirAUsuariosDTO(List<Usuarios> usuarios) {
        List<UsuariosDTO> usuariosDTO = new ArrayList<>();
        for (Usuarios usuario : usuarios) {
            UsuariosDTO usuarioDTO = new UsuariosDTO();
            usuarioDTO.setId(usuario.getId());
            usuarioDTO.setNombreUsuario(usuario.getNombreUsuario());
            usuarioDTO.setCorreoElectronico(usuario.getCorreoElectronico());
            usuarioDTO.setFotoPerfil(usuario.getFotoPerfil());
            usuarioDTO.setFechaRegistro(usuario.getFechaRegistro());
            usuariosDTO.add(usuarioDTO);
        }
        return usuariosDTO;
    }
    
    
    public UsuariosDTO registrarUsuario(UsuariosDTO userDTO) {
        // Convertir DTO a entidad
        Usuarios user = new Usuarios();
        user.setNombreUsuario(userDTO.getNombreUsuario());
        user.setCorreoElectronico(userDTO.getCorreoElectronico());
        user.setContrasena(Utilities.hashPassword(userDTO.getContrasena()));
        user.setFotoPerfil(userDTO.getFotoPerfil());
        user.setFechaRegistro(new Date());

        Usuarios savedUser = usuariosRepositorio.save(user);
        
        // Convertir la entidad guardada a DTO y devolverla
        return convertirAUsuariosDTO(savedUser);
    }
    
    public UsuariosDTO obtenerPorIdDTO(int id) {
        Usuarios usuario = usuariosRepositorio.findById(id).orElse(null);
        return usuario != null ? convertirAUsuariosDTO(usuario) : null;
    }

    public UsuariosDTO convertirAUsuariosDTO(Usuarios usuario) {
        UsuariosDTO usuarioDTO = new UsuariosDTO();
        usuarioDTO.setId(usuario.getId());
        usuarioDTO.setNombreUsuario(usuario.getNombreUsuario());
        usuarioDTO.setContrasena(usuario.getContrasena());
        usuarioDTO.setCorreoElectronico(usuario.getCorreoElectronico());
        usuarioDTO.setFotoPerfil(usuario.getFotoPerfil());
        usuarioDTO.setFechaRegistro(usuario.getFechaRegistro());
        return usuarioDTO;
    }

}
