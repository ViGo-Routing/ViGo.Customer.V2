import {
  // FlatList,
  // Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  // Text,
  TouchableOpacity,
  View,
} from "react-native";
import { themeColors, vigoStyles } from "../../assets/theme";
import Header from "../../components/Header/Header";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import {
  getWalletByUserId,
  getWalletTransactions,
} from "../../service/walletService";
import { vndFormat } from "../../utils/numberUtils";
import Divider from "../../components/Divider/Divider";
import { ArrowRightCircleIcon } from "react-native-heroicons/outline";
// import {
//   CheckCircleIcon,
//   ClockIcon,
//   ExclamationCircleIcon,
// } from "react-native-heroicons/solid";
import {
  renderTransacionType,
  // renderTransacionType,
  renderTransactionListItem,
  renderTransactionStatus,
  renderTransactionTypeOperator,
  // renderTransactionStatus,
} from "../../utils/enumUtils/walletEnumUtils";
import { PlusCircleIcon, PlusSmallIcon } from "react-native-heroicons/solid";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  Box,
  HStack,
  Heading,
  Text,
  VStack,
  Pressable,
  Button,
  FlatList,
} from "native-base";
import ErrorAlert from "../../components/Alert/ErrorAlert";
import RefreshableScrollView from "../../components/List/RefreshableScrollView";
import { useErrorHandlingHook } from "../../hooks/useErrorHandlingHook";
import TransactionItem from "../../components/WalletTransaction/TransactionItem";
import { getErrorMessage } from "../../utils/alertUtils";
import InfoAlert from "../../components/Alert/InfoAlert";

const WalletScreen = () => {
  const navigation = useNavigation();
  const [walletBalance, setWalletBalance] = useState(0);
  const [wallet, setWallet] = useState(null);

  const [walletTransactions, setWalletTransactions] = useState([]);

  const { user } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);
  const { isError, setIsError, errorMessage, setErrorMessage } =
    useErrorHandlingHook();

  const getWallet = async () => {
    try {
      setIsLoading(true);
      console.log(user.id);

      // console.log(user);
      const userWallet = await getWalletByUserId(user.id);
      setWallet(userWallet);
      setWalletBalance(userWallet.balance);

      // console.log(wallet);
      await getTransacions(userWallet.id);
    } catch (err) {
      setErrorMessage(getErrorMessage(err));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getTransacions = async (walletId) => {
    const transactions = await getWalletTransactions(walletId, 3, 1);
    // console.log(transactions);
    setWalletTransactions(transactions.data);
  };

  const renderTransactionListItem = (transaction) => {
    return <TransactionItem renderType="list" transaction={transaction} />;
  };

  useEffect(() => {
    const onFocus = navigation.addListener("focus", () => {
      getWallet();
    });
    return onFocus;
  }, [navigation]);

  // useFocusEffect(
  //   useCallback(() => {
  //     return () => getWallet();
  //   }, [navigation])
  // );

  // navigation.addListener("focus", () => {
  //   getWallet();
  // });

  return (
    <SafeAreaView style={vigoStyles.container}>
      <View>
        <Header title="Ví của tôi" />
      </View>

      {/* <ScrollView style={vigoStyles.body}> */}
      <View style={vigoStyles.body}>
        <ErrorAlert isError={isError} errorMessage={errorMessage}>
          <RefreshableScrollView refreshing={isLoading} onRefresh={getWallet}>
            <View style={styles.balanceContainer}>
              <View style={vigoStyles.textContainer}>
                <Text bold fontSize={"xl"}>
                  Số dư: {vndFormat(walletBalance)}
                </Text>
              </View>
            </View>
            <Box flexDirection={"row-reverse"} marginTop={5}>
              <Button
                style={vigoStyles.buttonWhite}
                onPress={() => navigation.navigate("Topup")}
                leftIcon={
                  <PlusCircleIcon
                    style={{ ...vigoStyles.buttonWhiteText }}
                    size={15}
                  />
                }
              >
                <Text style={vigoStyles.buttonWhiteText}>Nạp tiền</Text>
              </Button>
            </Box>
            <Divider style={vigoStyles.sectionDivider} />

            <Box>
              <HStack justifyContent={"space-between"} mb="5">
                <Heading size="lg">Lịch sử giao dịch</Heading>
                {/* <EvilIcons name="arrow-right" size={30} color="black" /> */}
                <Pressable
                  onPress={() =>
                    navigation.navigate("WalletTransactions", {
                      walletId: wallet.id,
                    })
                  }
                >
                  <ArrowRightCircleIcon size={30} color="black" />
                </Pressable>
              </HStack>
              {/* <FlatList
                style={vigoStyles.list}
                data={walletTransacions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("WalletTransactionDetail", {
                          walletTransactionId: item.id,
                        })
                      }
                    >
                      {renderTransactionListItem(item)}
                      <Divider style={vigoStyles.listDivider} />
                    </TouchableOpacity>
                  );
                }}
              /> */}
              {walletTransactions.length == 0 && (
                <InfoAlert message="Chưa có giao dịch nào" />
              )}
              {walletTransactions.length > 0 &&
                walletTransactions.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() =>
                      navigation.navigate("WalletTransactionDetail", {
                        walletTransactionId: item.id,
                      })
                    }
                  >
                    {renderTransactionListItem(item)}
                    <Divider style={vigoStyles.listDivider} />
                  </TouchableOpacity>
                ))}
            </Box>
          </RefreshableScrollView>
        </ErrorAlert>
        {/* </ScrollView> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    // backgroundColor: themeColors.linear,
    backgroundColor: themeColors.cardColor,
    // backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  balance: {
    fontSize: 18,
    fontWeight: "bold",
  },

  transactionNameListItem: {
    fontSize: 16,
  },
  transactionSubtitle: {
    // marginLeft: 10,
    fontSize: 14,
    color: "#999",
  },
});

export default WalletScreen;
