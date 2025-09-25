package com.condominio.repository;

import com.condominio.model.Visitante;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VisitanteRepository extends JpaRepository<Visitante, Long> {

    // Buscar visitante pelo CPF (único)
    Optional<Visitante> findByCpf(String cpf);

    // Buscar visitante pelo documento
    Optional<Visitante> findByDocumento(String documento);

    // Verificar se já existe um visitante com determinado CPF
    boolean existsByCpf(String cpf);
}
