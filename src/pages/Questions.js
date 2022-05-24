import { 
  Button,  
  Typography, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Stack } from "@mui/material";
import { Box } from "@mui/system";
import { decode } from "html-entities";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import useAxios from "../hooks/useAxios";
import { handleScoreChange, handleTotalQuestionsChange } from "../redux/actions";

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const Questions = () => {
  const {
    score,
  } = useSelector((state) => state);
  const history = useHistory();
  const dispatch = useDispatch();

  let apiUrl = `/api/questions/1`;
  
  const { response } = useAxios({ url: apiUrl });
  const [questionIndex, setQuestionIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState('');

  useEffect(() => {
    if (response?.results.length) {
      const question = response.results[questionIndex];
      let answers = [...question.incorrect_answers];
      answers.splice(
        getRandomInt(question.incorrect_answers.length),
        0,
        question.correct_answer
      );
      setOptions(answers);
    }
  }, [response, questionIndex]);

  

  const handleClickAnswer = (e) => {
    setValue(e.target.value);
    const question = response.results[questionIndex];
    if (e.target.value === question.correct_answer) {
      dispatch(handleScoreChange(score + 1));
    }
    dispatch(handleTotalQuestionsChange(response?.results.length));
  };

  const handleClickBtnAdvance = () => {
    if (questionIndex + 1 < response.results.length) {
      setQuestionIndex(questionIndex + 1);
    } else {
      history.push("/score");
    }
  }

  const handleClickBtnReturn = () => {
    if (questionIndex > 0 && questionIndex < response.results.length) {
      setQuestionIndex(questionIndex - 1);
    }
  }

  return (
    <Box>
      <Typography variant="h4">{questionIndex + 1} / {response.results.length}</Typography>
      <Typography mt={5}>
        {decode(response.results[questionIndex].question)}
      </Typography>
      
      <RadioGroup 
      name="radio-buttons-group"
      value={value}
      onChange={handleClickAnswer}
      >
      {options.map((data, id) => (
        <Box mt={2} key={id}>
          <FormControlLabel value={decode(data)} control={<Radio />} label={decode(data)} />
        </Box>
      ))}
      </RadioGroup>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          '& > *': { m: 1},
        }}
      >
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleClickBtnReturn}>Voltar</Button>
          <Button variant="contained" onClick={handleClickBtnAdvance} >Avançar</Button>
        </Stack>
      </Box>

    </Box>
  );
};

export default Questions;
