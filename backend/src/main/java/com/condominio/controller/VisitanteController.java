package com.condominio.controller;

import com.condominio.model.Visitante;
import com.condominio.repository.VisitanteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/visitantes") // 🔹 Alterado para incluir /api
@CrossOrigin(origins = "*") // 🔹 Permite requisições de qualquer origem (apenas para teste)
public class VisitanteController {

    @Autowired
    private VisitanteRepository visitanteRepository;

    @GetMapping("/home")
    public String home() {
        return "Bem-vindo ao Registro de Visitantes!";
    }

    @GetMapping
    public List<Visitante> listarVisitantes() {
        return visitanteRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Visitante> getVisitante(@PathVariable String id) {
        try {
            Long visitanteId = Long.parseLong(id.replaceAll("\\D", ""));
            Optional<Visitante> visitante = visitanteRepository.findById(visitanteId);
            return visitante.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/salvar")
    public ResponseEntity<String> criarVisitante(@RequestBody Visitante visitante) {
        // Validação mínima
        if (visitante.getNome() == null || visitante.getNome().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erro: Nome do visitante é obrigatório.");
        }

        // Checa CPF duplicado
        if (visitante.getCpf() != null && visitanteRepository.existsByCpf(visitante.getCpf())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("CPF já cadastrado!");
        }

        // Checa Autorizador duplicado
        if (visitante.getAutorizador() != null && visitanteRepository.findByAutorizador(visitante.getAutorizador()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Erro: já existe um visitante cadastrado com este Autorizador.");
        }

        // Forçar morador como nulo para evitar foreign key constraint
        visitante.setMorador(null);

        // Permitir condominio nulo, default para 1
        if (visitante.getCondominio() == null) {
            visitante.setCondominio(new com.condominio.model.Condominio());
            visitante.getCondominio().setId(1L);
        }

        visitanteRepository.save(visitante);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Visitante cadastrado com sucesso!");
    }

    @PutMapping("/{id}")
    public ResponseEntity<Visitante> atualizarVisitante(@PathVariable String id, @RequestBody Visitante dados) {
        try {
            Long visitanteId = Long.parseLong(id.replaceAll("\\D", ""));
            Optional<Visitante> visitanteExistente = visitanteRepository.findById(visitanteId);

            if (visitanteExistente.isPresent()) {
                Visitante v = visitanteExistente.get();
                v.setNome(dados.getNome());
                v.setCpf(dados.getCpf());
                v.setContato(dados.getContato());
                v.setEmpresa(dados.getEmpresa());
                v.setEndereco(dados.getEndereco());
                v.setDataVisita(dados.getDataVisita());
                v.setRazaoVisita(dados.getRazaoVisita());
                v.setNumeroCasa(dados.getNumeroCasa());
                v.setNomeVisitado(dados.getNomeVisitado());
                v.setTelefoneVisitado(dados.getTelefoneVisitado());
                v.setAutorizador(dados.getAutorizador());
                v.setMorador(dados.getMorador());
                v.setCondominio(dados.getCondominio());

                Visitante atualizado = visitanteRepository.save(v);
                return ResponseEntity.ok(atualizado);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarVisitante(@PathVariable String id) {
        try {
            Long visitanteId = Long.parseLong(id.replaceAll("\\D", ""));
            if (visitanteRepository.existsById(visitanteId)) {
                visitanteRepository.deleteById(visitanteId);
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}



