package com.condominio.controller;

import com.condominio.model.Visitante;
import com.condominio.repository.VisitanteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/visitantes")
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

    @PostMapping
    public ResponseEntity<String> criarVisitante(@RequestBody Visitante visitante) {
        Optional<Visitante> visitanteExistente = visitanteRepository.findByDocumento(visitante.getDocumento());

        if (visitanteExistente.isPresent()) {
            return ResponseEntity.badRequest().body("Visitante já cadastrado!");
        }

        visitanteRepository.save(visitante);
        return ResponseEntity.ok("Visitante cadastrado com sucesso!");
    }

    @PutMapping("/{id}")
    public ResponseEntity<Visitante> atualizarVisitante(@PathVariable String id, @RequestBody Visitante dados) {
        try {
            Long visitanteId = Long.parseLong(id.replaceAll("\\D", ""));
            Optional<Visitante> visitanteExistente = visitanteRepository.findById(visitanteId);

            if (visitanteExistente.isPresent()) {
                Visitante v = visitanteExistente.get();
                v.setNome(dados.getNome());
                v.setDocumento(dados.getDocumento());
                v.setDataVisita(dados.getDataVisita());
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

