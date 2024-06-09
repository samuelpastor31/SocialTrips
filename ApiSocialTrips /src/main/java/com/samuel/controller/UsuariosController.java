package com.samuel.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.samuel.modelo.Comentarios;
import com.samuel.modelo.Itinerarios;
import com.samuel.modelo.MeGusta;
import com.samuel.modelo.Usuarios;
import com.samuel.modeloDTO.UsuariosDTO;
import com.samuel.repository.UsuariosRepository;
import com.samuel.service.ComentariosService;
import com.samuel.service.ItinerariosService;
import com.samuel.service.MeGustaService;
import com.samuel.service.UsuariosService;
import com.samuel.utils.Utilities;

@RestController
@RequestMapping("/usuarios")
public class UsuariosController {

    private final UsuariosService usuariosServicio;
    private final UsuariosRepository usuariosRepository;
    private final ItinerariosService itinerariosService;
    private final MeGustaService megustaService;
    private final ComentariosService comentariosService;

    @Autowired
    public UsuariosController(UsuariosService usuariosServicio, UsuariosRepository usuariosRepository,
                              ItinerariosService itinerariosService, MeGustaService megustaService, ComentariosService comentariosService) {
        this.usuariosServicio = usuariosServicio;
        this.usuariosRepository = usuariosRepository;
        this.itinerariosService = itinerariosService;
        this.megustaService = megustaService;
        this.comentariosService = comentariosService;
    }

    @GetMapping("/by-username/{username}")
    public ResponseEntity<UsuariosDTO> getUserByUsername(@PathVariable String username) {
        Usuarios usuario = usuariosServicio.obtenerPorNombre(username);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        } else {
            UsuariosDTO usuarioDTO = usuariosServicio.convertirAUsuariosDTO(usuario);
            return ResponseEntity.ok(usuarioDTO);
        }
    }

    @GetMapping
    public ResponseEntity<List<UsuariosDTO>> obtenerTodosUsuarios() {
        List<UsuariosDTO> usuariosDTO = usuariosServicio.obtenerTodosDTO();
        return new ResponseEntity<>(usuariosDTO, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuariosDTO> obtenerUsuariosPorId(@PathVariable("id") int id) {
        UsuariosDTO usuarioDTO = usuariosServicio.obtenerPorIdDTO(id);
        if (usuarioDTO == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(usuarioDTO, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> actualizarUsuarios(@PathVariable("id") int id,
                                                     @RequestBody Map<String, Object> payload) {
        try {
            // Obtener el usuario existente
            Usuarios usuarioExistente = usuariosRepository.findById(id)
                    .orElseThrow(() -> new Exception("Usuario no encontrado"));

            // Actualizar los campos
            String contrasenaActual = (String) payload.get("contrasenaActual");
            String contrasenaNueva = (String) payload.get("contrasenaNueva");
            String nombreUsuario = (String) payload.get("nombreUsuario");
            String correoElectronico = (String) payload.get("correoElectronico");
            
            if (!Utilities.hashPassword(contrasenaActual).equals(usuarioExistente.getContrasena())) {
                throw new Exception("Contraseña actual incorrecta");
            }

            usuarioExistente.setNombreUsuario(nombreUsuario);
            usuarioExistente.setCorreoElectronico(correoElectronico);
            usuarioExistente.setContrasena(Utilities.hashPassword(contrasenaNueva));
            usuariosRepository.save(usuarioExistente);

            return new ResponseEntity<>("Perfil actualizado correctamente", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuarios(@PathVariable("id") int id) {
        Usuarios usuario = usuariosServicio.obtenerPorId(id);
        List<Itinerarios> itinerariosUsuario = usuario.getItinerarios();
        List<MeGusta> megustasUsuario = usuario.getMeGustas();
        List<Comentarios> comentariosUsuario = usuario.getComentarios();

        if (itinerariosUsuario.size() > 0) {
            for (int i = 0; i < itinerariosUsuario.size(); i++) {
                Itinerarios itinerarioAEliminar = itinerariosUsuario.get(i);
                itinerariosService.deleteById(itinerarioAEliminar.getId());
            }
        }

        if (megustasUsuario.size() > 0) {
            for (int i = 0; i < megustasUsuario.size(); i++) {
                MeGusta megusstaAEliminar = megustasUsuario.get(i);
                megustaService.deleteById(megusstaAEliminar.getId());
            }
        }

        if (comentariosUsuario.size() > 0) {
            for (int i = 0; i < comentariosUsuario.size(); i++) {
                Comentarios megusstaAEliminar = comentariosUsuario.get(i);
                comentariosService.deleteById(megusstaAEliminar.getId());
            }
        }

        usuariosServicio.eliminar(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UsuariosDTO userDTO) {
        if (usuariosServicio.obtenerPorNombre(userDTO.getNombreUsuario()) != null) {
            return ResponseEntity.badRequest().body("El nombre de usuario ya existe");
        }

        try {
            UsuariosDTO nuevoUsuario = usuariosServicio.registrarUsuario(userDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al registrar el usuario: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody UsuariosDTO loginUserDTO) {
        Usuarios user = usuariosRepository.findByNombre(loginUserDTO.getNombreUsuario());

        if (user == null) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }

        if (!Utilities.hashPassword(loginUserDTO.getContrasena()).equals(user.getContrasena())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Contraseña incorrecta");
        }

        return ResponseEntity.ok("Inicio de sesión exitoso para " + user.getNombreUsuario());
    }
    
    @PutMapping("/{id}/fotoPerfil")
    public ResponseEntity<String> actualizarFotoPerfil(@PathVariable("id") int id, @RequestBody Map<String, String> payload) {
        try {
            Usuarios usuarioExistente = usuariosRepository.findById(id)
                    .orElseThrow(() -> new Exception("Usuario no encontrado"));

            String nuevaFotoPerfil = payload.get("fotoPerfil");
            
            if (nuevaFotoPerfil == null || nuevaFotoPerfil.isEmpty()) {
                throw new Exception("La nueva foto de perfil no puede estar vacía");
            }

            usuarioExistente.setFotoPerfil(nuevaFotoPerfil);

            usuariosRepository.save(usuarioExistente);

            return new ResponseEntity<>("Foto de perfil actualizada correctamente", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}
