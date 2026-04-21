from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import bcrypt

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    is_verified = db.Column(db.Boolean, default=False)
    otp_code = db.Column(db.String(6), nullable=True)
    otp_expiry = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    outcomes = db.relationship('Outcome', backref='user', lazy=True)
    
    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'is_admin': self.is_admin,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat()
        }


class Outcome(db.Model):
    __tablename__ = 'outcomes'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    career = db.Column(db.String(100), nullable=False)
    goals = db.Column(db.Text, nullable=True)
    lifestyle = db.Column(db.String(100), nullable=False)
    choice = db.Column(db.String(100), nullable=False)
    happiness = db.Column(db.Float, nullable=False)
    success = db.Column(db.Float, nullable=False)
    finance = db.Column(db.Float, nullable=False)
    projection = db.Column(db.Text, nullable=False)
    story = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'age': self.age,
            'career': self.career,
            'goals': self.goals,
            'lifestyle': self.lifestyle,
            'choice': self.choice,
            'happiness': self.happiness,
            'success': self.success,
            'finance': self.finance,
            'projection': self.projection,
            'story': self.story,
            'created_at': self.created_at.isoformat()
        }
