import { FunctionComponent } from "react";

import "./style/typography.css";

import { useAppSelector, useAppDispatch } from "./redux/hooks";
import { setIsTestStarted, setSentences } from "./redux/store/testSlice";

import Test from "./components/Test";
import ModalWindow from "./components/ui/ModalWindow";
import Button from "./components/ui/Button";
import Select from "./components/ui/Select";

const App: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const isTestStarted = useAppSelector(
    (state) => state.testSlice.isTestStarted
  );
  const sentences = useAppSelector((state) => state.testSlice.sentences);

  //Выбо количества предложений
  const sentencesOptions = [
    { value: "1", name: "1" },
    { value: "2", name: "2" },
    { value: "3", name: "3" },
    { value: "4", name: "4" },
    { value: "5", name: "5" },
    { value: "6", name: "6" },
    { value: "7", name: "7" },
    { value: "8", name: "8" },
    { value: "9", name: "9" },
    { value: "10", name: "10" },
  ];

  // Функция для начала теста
  const testStateToggler = () => dispatch(setIsTestStarted(true));

  // Функция для изменения количества предложений
  const changeSentences = (value: string) => dispatch(setSentences(value));

  return (
    <>
      <main className="container main">
        {isTestStarted ? (
          // Если тест начат, отображается компонент Test
          <Test />
        ) : (
          <ModalWindow title="Пройди тест на скорость печати!">
            <label className="paragraph" htmlFor="select-senteces">
              Выбери количество предложений
            </label>
            <Select
              id="select-senteces"
              defaultValue={sentences}
              options={sentencesOptions}
              // Обработчик изменения выбора количества предложений
              onChange={(event) => changeSentences(event.target.value)}
            />
            <Button btnText="старт" onClick={testStateToggler} />
          </ModalWindow>
        )}
      </main>
    </>
  );
};

export default App;
