package com.samuel.modelo;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "comentarios")
public class Comentarios implements java.io.Serializable {

    private static final long serialVersionUID = 1L;
    private int id;
    private Usuarios usuarios;
    private Itinerarios itinerarios;
    private String contenido;
    private Date fechaComentario;

    public Comentarios() {
    }

    public Comentarios(int id, Usuarios usuarios, Itinerarios itinerarios, String contenido, Date fechaComentario) {
        this.id = id;
        this.usuarios = usuarios;
        this.itinerarios = itinerarios;
        this.contenido = contenido;
        this.fechaComentario = fechaComentario;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    public int getId() {
        return this.id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    public Usuarios getUsuarios() {
        return this.usuarios;
    }

    public void setUsuarios(Usuarios usuarios) {
        this.usuarios = usuarios;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_destino", nullable = false)
    public Itinerarios getItinerarios() {
        return this.itinerarios;
    }

    public void setItinerarios(Itinerarios itinerarios) {
        this.itinerarios = itinerarios;
    }

    @Column(name = "contenido", nullable = false, length = 65535)
    public String getContenido() {
        return this.contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "fecha_comentario", nullable = false, length = 19)
    public Date getFechaComentario() {
        return this.fechaComentario;
    }

    public void setFechaComentario(Date fechaComentario) {
        this.fechaComentario = fechaComentario;
    }
}
