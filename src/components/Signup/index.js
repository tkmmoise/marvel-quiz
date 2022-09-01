import React,{useState,useContext} from 'react';
import {Link} from 'react-router-dom'
import {FirebaseContext} from '../Firebase'


const Signup = (props) => {
    
    const firebase = useContext(FirebaseContext);

    const data = {
        pseudo: '',
        email: '',
        password: '',
        confirmPassword: ''
    }

    const [loginData, setLoginData] = useState(data);
    const [error, setError] = useState('');

    const {pseudo,email,password,confirmPassword} = loginData;

    //fonctions handle
    const handleChange = (e) => {
        setLoginData({...loginData, [e.target.id]: e.target.value })
    }

    const handleSubmit = (e) => {
        setError('');
        e.preventDefault();
        const {email,password,pseudo} = loginData;
        firebase.signupUser(email,password)
        .then((authUser) => {
            return firebase.user(authUser.user.uid).set({
                pseudo,
                email
            })
        })
        .then( () =>{
            setLoginData({...data});
            props.history.push('/welcome');
        })
        .catch(err =>{
            setError(err);
            setLoginData({...data});
        })
        
    }

    //verification form
    const btn = pseudo === '' || email === '' || password === '' || password !== confirmPassword ?
    (<button disabled>Inscription</button>) : (<button>Inscription</button>)

    //gestion erreur
    const errorMsg = error !== '' && <span> {error.message} </span>
    return (
        <div className="signUpLoginBox">
            <div className="slContainer">
                <div className="formBoxLeftSignup">

                </div>

                <div className="formBoxRight">
                    <div className="formContent">
                        <h2>Inscription</h2>
                        {errorMsg}

                        <form onSubmit={handleSubmit}>
                            <div className="inputBox">
                                <input onChange={handleChange} value={pseudo} type="text" id="pseudo" autoComplete="off" required/>
                                <label htmlFor="pseudo">Pseudo</label>
                            </div>
                            <div className="inputBox">
                                <input onChange={handleChange} value={email} type="email" id="email" autoComplete="off" required/>
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="inputBox">
                                <input onChange={handleChange} value={password} type="password" id="password" autoComplete="off" required/>
                                <label htmlFor="password">Mot de passe</label>
                            </div>
                            <div className="inputBox">
                                <input onChange={handleChange} value={confirmPassword} type="password" id="confirmPassword" autoComplete="off" required/>
                                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                            </div>

                            {btn}

                        </form>
                        <div className="linkContainer">
                            <Link className="simpleLink" to="/login">Déjà inscrit? Connectez-vous</Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Signup
