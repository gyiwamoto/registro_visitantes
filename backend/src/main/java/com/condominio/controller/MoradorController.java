package com.condominio.controller;

import com.condominio.model.Morador;
import com.condominio.repository.MoradorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/moradores")
public class MoradorController {

    @Autowired
    private MoradorRepository moradorRepository;

    /**
     * Endpoint: GET /api/moradores/verificar-nome?nome=NomeBuscado
     * Verifica se um morador com o nome especificado existe no banco de dados.
     */
    @GetMapping("/verificar-nome")
    public ResponseEntity<String> verificarNomeMorador(@RequestParam String nome) {

        if (nome == null || nome.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("O nome não pode estar vazio.");
        }

        // Busca o morador no banco de dados
        boolean moradorExiste = moradorRepository.findByNomeIgnoreCase(nome.trim()).isPresent();

        if (moradorExiste) {
            // Retorna 200 OK se o nome foi encontrado
            return ResponseEntity.ok("Morador encontrado.");
        } else {
            // Retorna 404 Not Found se o nome NÃO foi encontrado
            return ResponseEntity.notFound().build();
        }
    }
}
