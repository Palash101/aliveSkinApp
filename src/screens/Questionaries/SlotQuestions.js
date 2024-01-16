import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {assets} from '../../config/AssetsConfig';
import {
  RoundedDefaultButton,
  RoundedGreyButton,
  RoundedGreyButton2,
  ThemeButton,
  ThemeButton2,
} from '../../components/Buttons';
import {Input} from '../../components/Input/input';
// import DatePicker from 'react-native-datepicker';
import DatePicker from '@react-native-community/datetimepicker';
import DateTimePicker from '@react-native-community/datetimepicker';

import moment from 'moment';
import {UserContext} from '../../../context/UserContext';
import {AuthContoller} from '../../controllers/AuthController';
import PageLoader from '../../components/PageLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressStepBar from '../../components/ProgressStepBar';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const SlotQuestions = () => {
  const navigation = useNavigation();
  const dt = new Date();
  const [loading, setLoading] = useState(false);
  const maxDate = new Date(dt.setFullYear(dt.getFullYear() - 15));
  const [datePicker, setDatePicker] = useState(false);
  const {getToken, getUser} = useContext(UserContext);
  const userCtx = useContext(UserContext);
  const [disable, setDisable] = useState(true);
  const [check, setCheck] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [active, setActive] = useState(0);
  const [myQuestions, setMyQuestions] = useState([]);
  const [refresh, setRefresh] = useState(true)

  useEffect(() => {
    setLoading(true);
    getQuestions();
  }, []);

  const getQuestions = async () => {
    const token = await getToken();
    if (token) {
      const instance = new AuthContoller();
      const result = await instance.allQuestions(token);
      console.log(result.questions.length, 'ressss');
      setQuestions(result.questions);

      let allQue = [];
      result.questions.map(item => {
        allQue.push({
          id: item.id,
          questions: item.questions,
          answers:
            item?.answer_type === 'Options' ? JSON.parse(item?.answer) : '',
          answer_type: item?.answer_type,
          answer: '',
        });
      });

      console.log(allQue, 'allQue');
      setMyQuestions(allQue);

      setLoading(false);
    }
  };

  const next = async () => {
    if (active === questions.length - 1) {
      saveData();
    } else {
      setActive(active + 1);
    }
  };

  const saveData = async () => {
    setLoading(true);
    const token = await getToken();
    console.log(token);
    navigation.navigate('Slots');
    setLoading(false);
  };

  const saveAnswer = async item => {
    let allQuestion = myQuestions;
    allQuestion[active].answer = item;
    setMyQuestions(allQuestion);
    console.log(allQuestion,'qllll')
    setRefresh(!refresh)
  };

  useEffect(() => {
    console.log(myQuestions, 'ans');
  }, [refresh]);


  const goBack = () => {
    if (active > 0) {
      setActive(active - 1);
    } else {
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.container}>
      {questions?.length ? (
        <ProgressStepBar total={questions?.length} step={active + 1} />
      ) : (
        <></>
      )}
      <PageLoader loading={loading} />

      <KeyboardAvoidingView behavior="padding">
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={{width: width}}>
            {questions?.length ? (
              <View style={styles.faceBox}>
                <TouchableOpacity
                  style={styles.backBox}
                  onPress={() => goBack()}>
                  <Image source={assets.back} style={styles.backIcon} />
                </TouchableOpacity>

                <Text style={styles.title}>
                  Hey, Help us with some quick questions
                </Text>
                <Image source={assets.qbg} style={styles.logo} />
                <Text style={styles.label}>
                  {myQuestions[active]?.questions}
                </Text>
              </View>
            ) : (
              <></>
            )}

            <View style={styles.containerBottom}>
              {myQuestions[active]?.answer_type === 'Options' ? (
                <View style={styles.answerBox}>
                  {myQuestions[active]?.answers.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => saveAnswer(item)}
                      style={[
                        styles.answerItem,
                        myQuestions[active]?.answer === item
                          ? styles.activeAnswer
                          : {},
                      ]}>
                      <Text
                        style={[
                          styles.answerText,
                          myQuestions[active]?.answer === item
                            ? styles.activeAnswerText
                            : {},
                        ]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <>
                  {myQuestions[active]?.answer_type === 'Boolean' ? (
                    <View style={styles.answerBox}>
                      <TouchableOpacity
                        onPress={() => saveAnswer('Yes')}
                        style={[
                          styles.answerItem,
                          myQuestions[active]?.answer === 'Yes'
                            ? styles.activeAnswer
                            : {},
                        ]}>
                        <Text
                          style={[
                            styles.answerText,
                            myQuestions[active]?.answer === 'Yes'
                              ? styles.activeAnswerText
                              : {},
                          ]}>
                          Yes
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => saveAnswer('No')}
                        style={[
                          styles.answerItem,
                          myQuestions[active]?.answer === 'No'
                            ? styles.activeAnswer
                            : {},
                        ]}>
                        <Text
                          style={[
                            styles.answerText,
                            myQuestions[active]?.answer === 'No'
                              ? styles.activeAnswerText
                              : {},
                          ]}>
                          No
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View>
                      <Input
                        value={myQuestions[active]?.answer}
                        label={'Enter your answer'}
                        onChang={saveAnswer}
                      />
                    </View>
                  )}
                </>
              )}

              {myQuestions[active]?.answer ? (
                <ThemeButton
                  style={styles.button}
                  onPress={() => next()}
                  label={'Next'}
                />
              ) : (
                <RoundedDefaultButton style={styles.button} label={'Next'} />
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
export default SlotQuestions;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    textAlign: 'center',
    alignItems: 'center',
    top: 0,
    bottom: 0,
    position: 'absolute',
    left: 0,
    right: 0,
  },
  activeAnswer: {
    backgroundColor: '#E2D8CF',
  },
  logo: {
    width: width - 100,
    height: 250,
    alignSelf: 'center',
  },
  answerBox: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    flexWrap: 'wrap',
  },
  answerItem: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  answerText: {
    fontSize: 12,
    color: '#000',
    fontFamily: 'Gotham-Book',
    lineHeight: 16,
  },
  otpBox: {
    marginTop: 40,
    width: 250,
  },
  label: {
    color: '#000',
    position: 'absolute',
    bottom: 20,
    fontFamily: 'Gotham-Medium',
    left: 20,
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 20,
  },
  label1: {
    color: '#000',
    position: 'absolute',
    bottom: 60,
    fontFamily: 'Gotham-Medium',
    left: 20,
    fontSize: 12,
  },
  containerBottom: {
    width: '100%',
    paddingHorizontal: 20,
  },
  inputBox: {
    backgroundColor: '#ddd',
    marginTop: 40,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 6,
    padding: 6,
  },
  backBox1: {
    marginTop: 50,
    backgroundColor: '#000',
    width: 80,
    height: 8,
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBox: {
    marginTop: 50,
    backgroundColor: '#000',
    width: 32,
    height: 32,
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backIcon: {
    tintColor: '#fff',
    width: 16,
    height: 16,
  },
  bottomTextBox: {
    marginTop: 20,
    paddingHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  bottomText: {
    fontSize: 10,
  },
  bottomTextBold: {
    fontSize: 10,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  faceBox: {
    height: 470,
    backgroundColor: '#E2D8CF',
    paddingBottom: 60,
    width: width,
    padding: 20,
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    textTransform: 'uppercase',
    textAlign: 'left',
    fontWeight: '800',
    marginBottom: 10,
    lineHeight: 32,
    color: '#000',
  },
  bold: {
    fontWeight: '700',
  },
  checkImage: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: '#563925',
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 10,
  },
  listText: {
    fontFamily: 'Gill Sans Medium',
    fontSize: 16,
  },
  button: {
    marginTop: 40,
    width: 150,
  },
  listBox: {
    backgroundColor: 'rgba(226,216,207,0.6)',
    padding: 25,
    borderRadius: 20,
    marginTop: -100,
  },
  countryPicker: {
    width: width - 170,
    marginLeft: 5,
    backgroundColor: 'transparent',
    color: '#000000',
    textTransform: 'uppercase',
    fontSize: 16,
    fontFamily: 'Gotham-Medium',
  },
  codeInput: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 32,
    width: 85,
    borderRadius: 6,
    paddingHorizontal: 5,
  },
  codeText: {
    fontSize: 16,
    marginTop: 7,
  },
});
