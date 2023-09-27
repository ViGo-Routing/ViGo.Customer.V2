import {
  // FlatList,
  SafeAreaView,
  // Text,
  TouchableOpacity,
  View,
} from "react-native";
import { vigoStyles } from "../../assets/theme";
import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import { getWalletTransactions } from "../../service/walletService";
import {
  renderTransacionType,
  renderTransactionStatus,
  renderTransactionTypeOperator,
} from "../../utils/enumUtils/walletEnumUtils";
import { useNavigation } from "@react-navigation/native";
import Divider from "../../components/Divider/Divider";
import { vndFormat } from "../../utils/numberUtils";
import { Text, FlatList, HStack, Box } from "native-base";
import TransactionItem from "../../components/WalletTransaction/TransactionItem";
import InfoAlert from "../../components/Alert/InfoAlert";

const WalletTransactionsScreen = ({ route }) => {
  const { walletId } = route.params;

  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [onScroll, setOnScroll] = useState(false);

  const [walletTransacions, setWalletTransacions] = useState([]);
  const [nextPageNumber, setNextPageNumber] = useState(1);

  const pageSize = 10;

  const getTransacions = async (walletId) => {
    try {
      setLoading(true);

      const transactions = await getWalletTransactions(walletId, pageSize, 1);
      // console.log(transactions);
      setWalletTransacions(transactions.data);

      if (transactions.hasNextPage == true) {
        setNextPageNumber(2);
      } else {
        setNextPageNumber(null);
      }
    } catch (error) {
      handleError("Có lỗi xảy ra", error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreTransactions = async () => {
    if (!onScroll) {
      return;
    }

    // console.log(nextPageNumber);
    try {
      if (nextPageNumber > 1) {
        let moreTransactionsResponse = await getWalletTransactions(
          walletId,
          pageSize,
          nextPageNumber
        );

        const moreTransactions = [
          ...walletTransacions,
          ...moreTransactionsResponse.data,
        ];

        if (moreTransactionsResponse.hasNextPage == true) {
          setNextPageNumber(nextPageNumber + 1);
        } else {
          setNextPageNumber(null);
        }
      }
    } catch (error) {
      handleError("Có lỗi xảy ra", error);
      console.error(error);
    } finally {
    }
  };

  const renderTransactionListItem = (transaction) => {
    return (
      <TransactionItem
        renderType="list"
        key={transaction.id}
        transaction={transaction}
      />
    );
  };

  useEffect(() => {
    getTransacions(walletId);
  }, []);

  navigation.addListener("focus", () => {
    getTransacions(walletId);
  });

  return (
    <SafeAreaView style={vigoStyles.container}>
      <View>
        <Header title="Lịch sử giao dịch" />
      </View>

      <View style={vigoStyles.body}>
        <FlatList
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
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={<Divider style={vigoStyles.listDivider} />}
          ListEmptyComponent={<InfoAlert message="Chưa có giao dịch nào" />}
          refreshing={loading}
          onRefresh={() => getTransacions(walletId)}
          onEndReached={loadMoreTransactions}
          onScroll={() => {
            setOnScroll(true);
          }}
          onEndReachedThreshold={0.5}
          contentContainerStyle={{
            // paddingHorizontal: 20,
            paddingBottom: 20,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default WalletTransactionsScreen;
