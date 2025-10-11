package com.condominio;

import com.condominio.model.Morador;
import com.condominio.model.Condominio;
import com.condominio.repository.MoradorRepository;
import com.condominio.repository.CondominioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class RegistroVisitantesApplication {

    public static void main(String[] args) {
        SpringApplication.run(RegistroVisitantesApplication.class, args);
    }

    @Bean
    public CommandLineRunner loadData(MoradorRepository moradorRepository,
                                      CondominioRepository condominioRepository) {
        return (args) -> {
            // Cria um condomínio de teste
            Condominio condominio = new Condominio();
            condominio.setNome("Condomínio Teste");
            condominioRepository.save(condominio);

            // Cria um morador de teste associado ao condomínio
            Morador morador = new Morador();
            morador.setNome("Joao");
            morador.setCondominio(condominio); // associa corretamente
            moradorRepository.save(morador);

            System.out.println("Condomínio de teste criado: " + condominio.getNome());
            System.out.println("Morador de teste criado: " + morador.getNome());
        };
    }
}

