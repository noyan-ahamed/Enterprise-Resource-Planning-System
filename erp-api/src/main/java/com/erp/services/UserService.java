package com.erp.services;

import com.erp.enities.Users;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface UserService {
    Users createUser(Users user);
    List<Users> getAllUser();

   void initUserAndRole();
}
