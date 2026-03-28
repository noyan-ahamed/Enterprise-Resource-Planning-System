package com.erp.enities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;


public class Role {
    @Id
    private long id;
    private String name;
}
