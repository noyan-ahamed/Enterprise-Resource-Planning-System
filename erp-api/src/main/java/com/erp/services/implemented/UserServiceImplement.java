package com.erp.services.implemented;

import com.erp.enities.Role;
import com.erp.enities.Users;
import com.erp.enums.UserStatus;
import com.erp.repositories.RoleRepository;
import com.erp.repositories.UsersRepository;
import com.erp.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserServiceImplement implements UserService {
    private final UsersRepository userRepo;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Users createUser(Users user) {
        user.setCreated_at(LocalDate.now());
        return userRepo.save(user);
    }

    @Override
    public List<Users> getAllUser() {
        return userRepo.findAll();
    }

    @Override
    public void initUserAndRole() {

        if (userRepo.findByUserName("noyan@gmail.com").isPresent()) {
            return;
        }

        Role admin = roleRepository.findByName("ADMIN")
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setName("ADMIN");
                    return roleRepository.save(newRole);
                });

        Users adminUser = new Users();
        adminUser.setUserName("noyan@gmail.com");
        adminUser.setPassWord(passwordEncoder.encode("123456"));

        Set<Role> adminRoles = new HashSet<>();
        adminRoles.add(admin);
        adminUser.setRoles(adminRoles);

        adminUser.setPasswordChanged(false);
        adminUser.setStatus(UserStatus.ACTIVE);
        adminUser.setCreated_at(LocalDate.now());

        userRepo.save(adminUser);
    }
}
