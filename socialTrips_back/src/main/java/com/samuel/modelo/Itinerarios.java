package com.samuel.modelo;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.samuel.modeloDTO.ItinerariosDTO;

import jakarta.persistence.*;

@Entity
@Table(name = "itinerarios")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Itinerarios implements java.io.Serializable {

    private static final long serialVersionUID = 1L;
    private int id;
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuarios usuarios;
    private String titulo;
    private String descripcion;
    private Date fechaCreacion;
    private String destino;
    private Integer contadorMeGusta = 0;
    private String comentario;
    private Integer duracion;
    @JsonManagedReference
    private List<MeGusta> meGustas = new ArrayList<>();
    @JsonManagedReference
    private List<Comentarios> comentarios = new ArrayList<>();

    public Itinerarios() {
    }

    public Itinerarios(Usuarios usuarios, String titulo, Date fechaCreacion) {
        this.usuarios = usuarios;
        this.titulo = titulo;
        this.fechaCreacion = fechaCreacion;
    }

    public Itinerarios(Usuarios usuarios, String titulo, String descripcion, Date fechaCreacion, String destino,
                       Integer contadorMeGusta, String comentario, Integer duracion, List<MeGusta> meGustas, List<Comentarios> comentarios) {
        this.usuarios = usuarios;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.fechaCreacion = fechaCreacion;
        this.destino = destino;
        this.contadorMeGusta = contadorMeGusta;
        this.comentario = comentario;
        this.duracion = duracion;
        this.meGustas = meGustas;
        this.comentarios = comentarios;
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

    @Column(name = "titulo", nullable = false, length = 65535)
    public String getTitulo() {
        return this.titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    @Column(name = "descripcion", length = 65535)
    public String getDescripcion() {
        return this.descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "fecha_creacion", nullable = false, length = 19)
    public Date getFechaCreacion() {
        return this.fechaCreacion;
    }

    public void setFechaCreacion(Date fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    @Column(name = "destino", length = 65535)
    public String getDestino() {
        return this.destino;
    }

    public void setDestino(String destino) {
        this.destino = destino;
    }

    @Column(name = "contador_me_gusta")
    public Integer getContadorMeGusta() {
        return this.contadorMeGusta;
    }

    public void setContadorMeGusta(Integer contadorMeGusta) {
        this.contadorMeGusta = contadorMeGusta;
    }

    @Column(name = "comentario", length = 65535)
    public String getComentario() {
        return this.comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    @Column(name = "duracion") // Nuevo campo
    public Integer getDuracion() {
        return this.duracion;
    }

    public void setDuracion(Integer duracion) {
        this.duracion = duracion;
    }

    @JsonIgnore
    @JsonManagedReference
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "itinerarios", cascade = CascadeType.ALL, orphanRemoval = true)
    public List<MeGusta> getMeGustas() {
        return this.meGustas;
    }

    public void setMeGustas(List<MeGusta> meGustas) {
        this.meGustas = meGustas;
    }

    @JsonIgnore
    @JsonManagedReference
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "itinerarios", cascade = CascadeType.ALL, orphanRemoval = true)
    public List<Comentarios> getComentarioses() {
        return this.comentarios;
    }

    public void setComentarioses(List<Comentarios> comentarioses) {
        this.comentarios = comentarioses;
    }

    public ItinerariosDTO toDTO() {
        ItinerariosDTO dto = new ItinerariosDTO();
        dto.setId(this.id);
        dto.setIdUsuario(this.usuarios.getId());
        dto.setTitulo(this.titulo);
        dto.setDescripcion(this.descripcion);
        dto.setFechaCreacion(this.fechaCreacion);
        dto.setDestino(this.destino);
        dto.setContadorMeGusta(this.contadorMeGusta);
        dto.setComentario(this.comentario);
        dto.setDuracion(this.duracion);
        return dto;
    }
}
