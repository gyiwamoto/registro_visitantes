package com.condominio.repository;

import com.condominio.model.Visitante;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VisitanteRepository extends JpaRepository<Visitante, Long> {
    Optional<Visitante> findByDocumento(String documento);
}

