import { FunctionComponent, useRef } from "react";
import "../style/test.css";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { resetSeconds } from "../redux/store/timerSlice";
import {
  setIsTestFinished,
  resetTestState,
  setIsTestStarted,
} from "../redux/store/testSlice";
import { resetTextState, setText } from "../redux/store/textSlice";
import { restoreText } from "../helpers/charTransform";
import Text from "./Text";
import Stats from "./Stats";
import ModalWindow from "./ui/ModalWindow";
import Button from "./ui/Button";

const Test: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const isTestFinished = useAppSelector(
    (state) => state.testSlice.isTestFinished
  );
  const text = useAppSelector((state) => state.textSlice.text);
  // Ссылка на текстовое поле
  const inputRef = useRef<HTMLInputElement>(null);
  const testStateTogglerOff = () => dispatch(setIsTestStarted(false));

  function restart() {
    dispatch(resetSeconds());
    dispatch(resetTextState());
    dispatch(setText(restoreText(text)));

    if (isTestFinished) {
      // Сброс состояния завершения теста
      dispatch(setIsTestFinished(false));
    }
    // Установка фокуса на текстовое поле
    inputRef.current?.focus();
  }

  function newTest() {
    dispatch(resetTestState());
    dispatch(resetTextState());
    dispatch(resetSeconds());
  }

  return (
    <section className="test-container">
      <Text />
      <Stats>
        <Button
          btnText="обновить"
          onClick={restart}
          onFocus={(event) => event.target.blur()}
        />
        <Button
          btnText="настройки"
          onClick={testStateTogglerOff}
          onFocus={(event) => event.target.blur()}
        />
      </Stats>
      {isTestFinished && (
        <ModalWindow title="Тест пройден!">
          <Stats />
          <div className="buttons-container">
            <Button btnText="пройти заново" onClick={restart} />
            <Button btnText="новый тест" onClick={newTest} />
          </div>
        </ModalWindow>
      )}
      <input
        type="text"
        ref={inputRef}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} // Скрытое текстовое поле
      />
    </section>
  );
};

export default Test;
