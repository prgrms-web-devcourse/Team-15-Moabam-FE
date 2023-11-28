import { baseInstance, formDataInstance } from '../instance';
// import { ModifyMemberRequest } from '@/UserProfile/components/UserProfile';
import { MemberInfo, MyInfo } from '@/core/types/Member';

const memberAPI = {
  getMyInfo: async () => {
    return await baseInstance.get<MyInfo>('/members');
  },

  getMemberInfo: async (memberId = '') => {
    return await baseInstance.get<MemberInfo>(
      `/members${memberId ? '/' : ''}${memberId}`
    );
  },

  postMemberKakaoAuth: async (params: { code: string }) => {
    const { code } = params;

    return await baseInstance.post<{ signUp: boolean; id: number }>(
      `/members/login/kakao/oauth`,
      {
        code
      }
    );
  },

  editMyInfo: async (formData: FormData) => {
    for (const key of formData.keys()) {
      console.log(key, ':', formData.get(key));
    }
    return await formDataInstance.post(`/members/modify`, formData);
  },

  logout: async () => {
    return await baseInstance.get(`/members/logout`);
  },

  Withdrawal: async () => {
    return await baseInstance.delete(`/members`);
  }
};

export default memberAPI;
