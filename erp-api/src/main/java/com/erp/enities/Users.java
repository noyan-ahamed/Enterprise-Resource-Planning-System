package com.erp.enities;

import com.erp.enums.UserStatus;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.Set;


public class Users {
    @Id
    private long id;
    private String username;
    private String password;
    @Enumerated(EnumType.STRING)
    private UserStatus status;
    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = true)
    private Employee employeeId;
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles;
    @Column(name = "created_at")
    private LocalDate created_at;
}
