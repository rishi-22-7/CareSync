from pydantic import BaseModel


class AdminCreate(BaseModel):
    name: str
    email: str
    password: str


class AdminLogin(BaseModel):
    email: str
    password: str


class AdminPasswordChange(BaseModel):
    admin_id: int
    old_password: str
    new_password: str

