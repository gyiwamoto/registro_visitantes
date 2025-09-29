package com.exemplo.registrovisitantes; // Altere o nome do pacote conforme seu projeto

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MoradorRepository extends JpaRepository<Morador, Long> {

    /**
     * Busca um morador pelo nome (ignorando maiúsculas e minúsculas).
     * @param nomeMorador o nome do morador a ser procurado.
     * @return um objeto Optional contendo o Morador, se encontrado.
     */
    Optional<Morador> findByNomeMoradorIgnoreCase(String nomeMorador);
}