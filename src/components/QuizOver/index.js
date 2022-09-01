import React,{useEffect,useState} from 'react'
import {GiTrophyCup} from 'react-icons/gi'
import Loader from '../Loader'
import Modal from '../Modal'
import axios from 'axios'

const QuizOver = React.forwardRef((props,ref) => {
    // console.log(props)
    // console.log(ref)
    const {levelNames,score,maxQuestions,quizLevel,percent,loadLevelQuestion} = props;

    const API_PUBLIC_KEY = process.env.REACT_APP_MARVEL_API_KEY;
    const hash = '711a84bf09c844ec2c6e9c977fc36c29';

    const [asked, setAsked] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [characterInfo, setCharacterInfo] = useState([]);
    const [loadingModal, setLoadingModal] = useState(true);
    
    useEffect(() => {
        setAsked(ref.current);

        if(localStorage.getItem('marvelStorageDate')){
            const date = localStorage.getItem('marvelStorageDate');
            checkDateAge(date);
        }
    }, [ref])

    const checkDateAge = (date) => {
        const today = Date.now();
        const timeDifference = today - date;

        const daysDifference = timeDifference / (1000*3600*24);
        if(daysDifference>=15){
            localStorage.clear();
            localStorage.setItem('marvelStorageDate', Date.now());
        }
    }

    const showModal = (id) => {
        setOpenModal(true);

        if (localStorage.getItem(id)){
            setCharacterInfo(JSON.parse(localStorage.getItem(id)));
            setLoadingModal(false);
        }else{
            axios
            .get(`https://gateway.marvel.com/v1/public/characters/${id}?ts=1&apikey=${API_PUBLIC_KEY}&hash=${hash}`)
            .then((response)=>{
                console.log(response);
                setCharacterInfo(response.data)
                setLoadingModal(false)

                localStorage.setItem(id, JSON.stringify(response.data));
                if(!localStorage.getItem('marvelStorageDate')){
                    localStorage.setItem('marvelStorageDate', Date.now());
                }
                

            })
            .catch((err)=>{
                console.log(err);
            }) 
            }

        
    }

    const hideModal = () => {
        setOpenModal(false);
        setLoadingModal(true)
    }
    const capitalizeFirstLetter= (string)=>{
        return string.charAt(0).toUpperCase()+string.slice(1);
    }

    const averageGrade = maxQuestions/2;

    if(score < averageGrade){
        setTimeout(() => {
            loadLevelQuestion(quizLevel);
        }, 3000);
    }

    const decision = score >= averageGrade ? (
        <>
        <div className="stepsBtnContainer">
        {
            quizLevel < levelNames.length ? 
            (
                <>
                    <p className="successMsg">Bravo, Passer au niveau suivant</p>
                    <button 
                        className="btnResult success"
                        onClick={()=>loadLevelQuestion(quizLevel)}
                    >
                        Niveau suivant
                    </button>
                </>
            ):
            (
                <>
                    <p className="successMsg">
                       <GiTrophyCup size='50px' /> Bravo, Vous etes un expert
                    </p>
                    <button 
                        className="btnResult gameOver"
                        onClick={()=>loadLevelQuestion(0)}
                    >
                        Accueil
                    </button>
                </>
            )                
        }
        </div>
        <div className="percentage">
                <div className="progressPercent">Réussite: {percent} %</div>
                <div className="progressPercent">Note: {score}/{maxQuestions} </div>
        </div>
        </>
    ):
    (
        <>
            <div className="stepsBtnContainer">
                <p className="failureMsg">Vous avez échoué !</p>
            </div>
            <div className="percentage">
            <   div className="progressPercent">Réussite: {percent} %</div>
                <div className="progressPercent">Note: {score}/{maxQuestions} </div>
            </div>
        </>       
    )


    const questionAnswer = score >=averageGrade ? (
            asked.map(question =>{
                return (
                    <tr key={question.id}>
                        <td> {question.question} </td>
                        <td> {question.answer} </td>
                        <td><button 
                                className="btnInfo"
                                onClick={()=>showModal(question.heroId)}
                              >
                               Infos
                            </button>
                        </td>
                    </tr>
                )
            })
    ):
    (
        <tr>
            <td colSpan="3">
                <Loader 
                    loadingMsg={"pas de réponses!"}
                    styling={{textAlign:'center',color:'red'}}
                />
            </td>
        </tr>
    )
    
    const resultsModal = !loadingModal ? 
    (
        <>
            <div className="modalHeader">
                <h2> {characterInfo.data.results[0].name} </h2>
            </div>
            <div className="modalBody">
                <div className="comicImage">
                    <img 
                        src={characterInfo.data.results[0].thumbnail.path+'.'+characterInfo.data.results[0].thumbnail.extension} 
                        alt={characterInfo.data.results[0].name}
                    />
                    {characterInfo.attributionText}
                </div>
                <div className="comicDetails">
                    <h3>Description</h3>

                    {
                        characterInfo.data.results[0].description ?
                        <p> {characterInfo.data.results[0].description} </p>:
                        <p>Description indisponible ...</p>
                    }
                    <h3>Plus d'infos</h3>
                    {
                        characterInfo.data.results[0].urls && 
                        characterInfo.data.results[0].urls.map((url, index)=>{
                            return <a 
                                key={index}
                                href={url.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                >
                                    {capitalizeFirstLetter(url.type)}
                            </a>
                        })
                    }
                </div>
            </div>
            <div className="modalFooter">
                <button className="modalBtn" onClick={hideModal}>Fermer</button>
            </div>
        </>
        
    ) :
    (
        <>
            <div className="modalHeader">
                <h2> Response de Marvel </h2>
            </div>
            <div className="modalBody">
                <Loader />
            </div>
        </>
    )

    return (
        <>
            {decision }
            <hr/>
            <p>
                les reponses aux questions posés
            </p>
            <div className="answerContainer">
                <table className="answers">
                    <thead>
                        <tr>
                            <th>Question</th>
                            <th>Responses</th>
                            <th>Infos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questionAnswer}
                    </tbody>
                </table>
            </div>
            <Modal showModal={openModal}>
                {resultsModal}
            </Modal>
        </>
        
    )
})



export default React.memo(QuizOver) 