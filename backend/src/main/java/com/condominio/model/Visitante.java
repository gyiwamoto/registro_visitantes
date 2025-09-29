package com.condominio.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Visitante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(nullable = false, unique = true)   // CPF obrigatório e único
    private String cpf;

    private String contato;          // celular
    private String empresa;          // empresa ou "particular"
    private String endereco;         // endereço do visitante
    private LocalDate dataVisita;    // data da visita
    private String razaoVisita;      // razão da visita

    // Dados do visitado
    private String numeroCasa;
    private String nomeVisitado;
    private String telefoneVisitado;

    // Outros campos opcionais
    private String autorizador;        // RG ou outro doc, não único
    private String morador;
    private String condominio;

    // ================= Getters e Setters =================

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getContato() { return contato; }
    public void setContato(String contato) { this.contato = contato; }

    public String getEmpresa() { return empresa; }
    public void setEmpresa(String empresa) { this.empresa = empresa; }

    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }

    public LocalDate getDataVisita() { return dataVisita; }
    public void setDataVisita(LocalDate dataVisita) { this.dataVisita = dataVisita; }

    public String getRazaoVisita() { return razaoVisita; }
    public void setRazaoVisita(String razaoVisita) { this.razaoVisita = razaoVisita; }

    public String getNumeroCasa() { return numeroCasa; }
    public void setNumeroCasa(String numeroCasa) { this.numeroCasa = numeroCasa; }

    public String getNomeVisitado() { return nomeVisitado; }
    public void setNomeVisitado(String nomeVisitado) { this.nomeVisitado = nomeVisitado; }

    public String getTelefoneVisitado() { return telefoneVisitado; }
    public void setTelefoneVisitado(String telefoneVisitado) { this.telefoneVisitado = telefoneVisitado; }

    public String getAutorizador() { return autorizador; }
    public void setAutorizador(String autorizador) { this.autorizador = autorizador; }

    public String getMorador() { return morador; }
    public void setMorador(String morador) { this.morador = morador; }

    public String getCondominio() { return condominio; }
    public void setCondominio(String condominio) { this.condominio = condominio; }

    // ================= Método para compatibilidade =================
    public String getDocumento() {
        return this.autorizador;
    }
}
