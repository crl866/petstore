package com.petstore.repository;

import com.petstore.entity.AdoptionApplication;
import com.petstore.entity.ApplicationStatusEnum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicationRepository extends JpaRepository<AdoptionApplication, Long> {
    Page<AdoptionApplication> findByStatus(ApplicationStatusEnum status, Pageable pageable);

    Page<AdoptionApplication> findByStatusOrderBySubmittedAtDesc(ApplicationStatusEnum status, Pageable pageable);
}
