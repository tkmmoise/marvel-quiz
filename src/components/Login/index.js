import React,{useState,useEffect,useContext} from 'react'
import {FirebaseContext} from '../Firebase'
import {Link} from 'react-router-dom'

const Login = (props) => {
    
    const firebase = useContext(FirebaseContext)
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [btn, setBtn] = useState(false);
    const [error, setError] = useState('');

    
    
    useEffect(() => {
        if(password.length >5 && email !== ''){
            setBtn(true);
        }else if(btn){
            setBtn(false);
        }
    }, [password,email,btn])

    //fonctions handler
    const handleSubmit = (e) => {
        e.preventDefault();
        firebase.loginUser(email,password)
        .then((user) =>{
            setEmail('');
            setPassword('');
            props.history.push('/welcome');
        })
        .catch((err) => {
            setEmail('');
            setPassword('');
            setError(err);
        })
        
    }
   
    //gestion error
    const errorMsg = error !== '' && (<span> {error.message} </span>);

    //verification form
    const btnDisplay = btn ? (<button>Connexion</button>) : (<button disabled>Connexion</button>)

    return (
        <div className="signUpLoginBox">
            <div className="slContainer">
                <div className="formBoxLeftLogin">

                </div>

                <div className="formBoxRight">
                    <div className="formContent">
                        {errorMsg}
                        <h2>Connexion</h2>
                        <form onSubmit={handleSubmit}>
                                <div className="inputBox">
                                    <input onChange={(e) =>{setEmail(e.target.value)}} value={email} type="email" id="email" autoComplete="off" required/>
                                    <label htmlFor="email">Email</label>
                                </div>
                                <div className="inputBox">
                                    <input onChange={(e) =>{setPassword(e.target.value)}} value={password} type="password" id="password" autoComplete="off" required/>
                                    <label htmlFor="password">Mot de passe</label>
                                </div>
                                {btnDisplay}
                            </form>
                            <div className="linkContainer">
                                <Link className="simpleLink" to="/signup">Nouveau sur Marvel Quiz ? S'inscrire</Link>
                                <br />
                                <Link className="simpleLink" to="/forgetpassword">Mot de passe oublié ? Récuperer</Link>
                            </div>
                    </div>
                </div>
            </div>    
        </div>
    )
}  

export default Login
