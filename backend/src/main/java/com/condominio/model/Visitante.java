package com.condominio.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "visitantes")
public class Visitante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String documento;

    @Column(name = "veiculo", nullable = true)
    private String veiculo;

    @Column(name = "motivo", nullable = true)
    private String motivo;

    @Column(name = "entrada", nullable = false)
    private LocalDateTime entrada;

    @Column(name = "saida", nullable = true)
    private LocalDateTime saida;

    // Campos adicionais usados pelo controller
    @Column(name = "data_visita")
    private LocalDateTime dataVisita;

    @Column(name = "razao_visita")
    private String razaoVisita;

    @Column(name = "numero_casa")
    private String numeroCasa;

    @Column(name = "nome_visitado")
    private String nomeVisitado;

    @Column(name = "telefone_visitado")
    private String telefoneVisitado;

    @Column(name = "autorizador")
    private String autorizador;

    @Column(name = "cpf")
    private String cpf;

    @Column(name = "contato")
    private String contato;

    @Column(name = "empresa")
    private String empresa;

    @Column(name = "endereco")
    private String endereco;

    // Relacionamento com Morador (agora opcional)
    @ManyToOne
    @JoinColumn(name = "morador_id", nullable = true)
    private Morador morador;

    // Relacionamento com Condominio (agora opcional)
    @ManyToOne
    @JoinColumn(name = "condominio_id", nullable = true)
    private Condominio condominio;

    public Visitante() { }

    public Visitante(String nome, String documento, String veiculo, String motivo,
                     LocalDateTime dataVisita, String razaoVisita, String numeroCasa,
                     String nomeVisitado, String telefoneVisitado, String autorizador,
                     String cpf, String contato, String empresa, String endereco,
                     Morador morador, Condominio condominio) {
        this.nome = nome;
        this.documento = documento;
        this.veiculo = veiculo;
        this.motivo = motivo;
        this.dataVisita = dataVisita;
        this.razaoVisita = razaoVisita;
        this.numeroCasa = numeroCasa;
        this.nomeVisitado = nomeVisitado;
        this.telefoneVisitado = telefoneVisitado;
        this.autorizador = autorizador;
        this.cpf = cpf;
        this.contato = contato;
        this.empresa = empresa;
        this.endereco = endereco;
        this.morador = morador;
        this.condominio = condominio;
        this.entrada = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.entrada == null) {
            this.entrada = LocalDateTime.now();
        }
        if (this.dataVisita == null) {
            this.dataVisita = LocalDateTime.now();
        }
    }

    // ===== Getters e Setters =====
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDocumento() { return documento; }
    public void setDocumento(String documento) { this.documento = documento; }

    public String getVeiculo() { return veiculo; }
    public void setVeiculo(String veiculo) { this.veiculo = veiculo; }

    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }

    public LocalDateTime getEntrada() { return entrada; }
    public void setEntrada(LocalDateTime entrada) { this.entrada = entrada; }

    public LocalDateTime getSaida() { return saida; }
    public void setSaida(LocalDateTime saida) { this.saida = saida; }

    public LocalDateTime getDataVisita() { return dataVisita; }
    public void setDataVisita(LocalDateTime dataVisita) { this.dataVisita = dataVisita; }

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

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getContato() { return contato; }
    public void setContato(String contato) { this.contato = contato; }

    public String getEmpresa() { return empresa; }
    public void setEmpresa(String empresa) { this.empresa = empresa; }

    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }

    public Morador getMorador() { return morador; }
    public void setMorador(Morador morador) { this.morador = morador; }

    public Condominio getCondominio() { return condominio; }
    public void setCondominio(Condominio condominio) { this.condominio = condominio; }
}



