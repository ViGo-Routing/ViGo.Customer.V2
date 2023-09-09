import React, { useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Header from "../../components/Header/Header.jsx";
// import BottomNavigationBar from '../../components/NavBar/BottomNavigationBar.jsx'
import ProfileCard from "../../components/Card/ProfileCard.jsx";
import { themeColors } from "../../assets/theme/index.jsx";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowLeftOnRectangleIcon,
  BanknotesIcon,
  BellAlertIcon,
  BookmarkIcon,
  ClipboardDocumentListIcon,
  DocumentCheckIcon,
  PencilSquareIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  StarIcon,
  UserIcon,
  WalletIcon,
} from "react-native-heroicons/solid";
import { UserContext } from "../../context/UserContext.jsx";

const ProfileSreen = () => {
  const navigation = useNavigation();
  const listAccountUtilities = [
    {
      icon: <PencilSquareIcon size={24} color={themeColors.primary} />,
      label: "Chỉnh sửa hồ sơ",
      navigator: "EditProfile",
    },
    {
      icon: <WalletIcon size={24} color={themeColors.primary} />,
      label: "Ví của tôi",
      navigator: "Wallet",
    },
    {
      icon: <BellAlertIcon size={24} color={themeColors.primary} />,
      label: "Thông báo của tôi",
      navigator: "MyNotification",
    },
    {
      icon: <QuestionMarkCircleIcon size={24} color={themeColors.primary} />,
      label: "Trợ giúp & yêu cầu hỗ trợ",
      navigator: "Help",
    },
    // {
    //   icon: <BookmarkIcon size={24} color={themeColors.primary} />,
    //   label: "Địa điểm đã lưu",
    //   navigator: "MyAddresses",
    // },
    {
      icon: <ShieldCheckIcon size={24} color={themeColors.primary} />,
      label: "Bảo mật tài khoản",
      navigator: "Safety",
    },
    {
      icon: <UserIcon size={24} color={themeColors.primary} />,
      label: "Quản lý tài khoản",
      navigator: "Manage Account",
    },
  ];
  const listGeneralUtilities = [
    {
      icon: <DocumentCheckIcon size={24} color={themeColors.primary} />,
      label: "Quy chế",
      navigator: "RegulationScreen",
    },
    {
      icon: <ClipboardDocumentListIcon size={24} color={themeColors.primary} />,
      label: "Bảo mật & Điều khoản",
      navigator: "Screen2",
    },
    // { icon: 'analytics', label: 'Dữ liệu', navigator: 'Screen1' },
    {
      icon: <StarIcon size={24} color={themeColors.primary} />,
      label: "Đánh giá ứng dụng ViGo",
      navigator: "Screen2",
    },
    { icon: "", label: "", navigator: "" },
  ];

  const { user, setUser } = useContext(UserContext);

  const logout = async () => {
    // await removeItem("token");
    setUser(null);

    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header title="Thông tin tài khoản" />
      </View>
      <ScrollView style={styles.body}>
        <ProfileCard
          name={user.name}
          phoneNumber={user.phone}
          imageSource={
            user.avatarUrl
              ? {
                  uri: user.avatarUrl,
                }
              : require("../../assets/images/no-image.jpg")
          }
        />

        <Text style={styles.title}>Tài Khoản</Text>
        {listAccountUtilities.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.list}
            onPress={() => navigation.navigate(item.navigator)}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {item.icon}
              <Text style={{ marginLeft: 10 }}>{item.label}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          key="logout"
          style={styles.list}
          onPress={() => logout()}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ArrowLeftOnRectangleIcon size={24} color={themeColors.primary} />
            <Text style={{ marginLeft: 10 }}>Đăng xuất</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.title}>Thông tin chung</Text>
        {listGeneralUtilities.map((item, index) => (
          <TouchableOpacity key={index} style={styles.list}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {item.icon}
              <Text style={{ marginLeft: 10 }}>{item.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.footer}>{/* <BottomNavigationBar /> */}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column", // inner items will be added vertically
    flexGrow: 1, // all the available vertical space will be occupied by it
    justifyContent: "space-between", // will create the gutter between body and footer
  },
  body: {
    backgroundColor: themeColors.linear,
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 20,
  },
  list: {
    paddingTop: 20,
    fontSize: 20,
  },
});

export default ProfileSreen;
