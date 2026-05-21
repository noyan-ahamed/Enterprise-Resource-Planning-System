interface AuthenticationRequest{
    userName: string;
    userPassword: string
}

interface AuthenticationResponse{
    token: string;
    roles: Roles;
    passwordChanged: boolean
}

interface Roles{
    name: string;
}