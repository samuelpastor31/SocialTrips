package com.samuel.modeloDTO;

import java.util.Date;
import java.util.List;

public class ItinerariosDTO {

    private int id;
    private int idUsuario;
    private String titulo;
    private String descripcion;
    private Date fechaCreacion;
    private String destino;
    private Integer contadorMeGusta;
    private String comentario;
    private Integer duracion;
    private List<ComentariosDTO> comentarios; 

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(int idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Date getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(Date fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public String getDestino() {
        return destino;
    }

    public void setDestino(String destino) {
        this.destino = destino;
    }

    public Integer getContadorMeGusta() {
        return contadorMeGusta;
    }

    public void setContadorMeGusta(Integer contadorMeGusta) {
        this.contadorMeGusta = contadorMeGusta;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public Integer getDuracion() {
        return duracion;
    }

    public void setDuracion(Integer duracion) {
        this.duracion = duracion;
    }

    public List<ComentariosDTO> getComentarios() {
        return comentarios;
    }

    public void setComentarios(List<ComentariosDTO> comentarios) {
        this.comentarios = comentarios;
    }
}
