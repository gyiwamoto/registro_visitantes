package com.condominio.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "condominios")
public class Condominio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    // Relacionamento com moradores
    @OneToMany(mappedBy = "condominio", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Morador> moradores;

    public Condominio() { }

    public Condominio(String nome) {
        this.nome = nome;
    }

    // ===== Getters e Setters =====
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public List<Morador> getMoradores() { return moradores; }
    public void setMoradores(List<Morador> moradores) { this.moradores = moradores; }
}
