package com.samuel.modeloDTO;

import java.util.Date;

public class UsuariosDTO {
    
    private int id;
    private String nombreUsuario;
    private String correoElectronico;
    private String contrasena;
    private String fotoPerfil;
    private Date fechaRegistro;

    // Constructors
    public UsuariosDTO() {}

    public UsuariosDTO(int id, String nombreUsuario, String correoElectronico, String fotoPerfil, Date fechaRegistro) {
        this.id = id;
        this.nombreUsuario = nombreUsuario;
        this.correoElectronico = correoElectronico;
        this.fotoPerfil = fotoPerfil;
        this.fechaRegistro = fechaRegistro;
    }

    // Getters and setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getCorreoElectronico() {
        return correoElectronico;
    }

    public void setCorreoElectronico(String correoElectronico) {
        this.correoElectronico = correoElectronico;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }

    public String getFotoPerfil() {
        return fotoPerfil;
    }

    public void setFotoPerfil(String fotoPerfil) {
        this.fotoPerfil = fotoPerfil;
    }

    public Date getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(Date fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }
}