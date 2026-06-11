import baseApi from "./baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    userSignUp: builder.mutation({
      query: (data) => ({
        url: `/auth/signup`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
    userSocialLogin: builder.mutation({
      query: (data) => ({
        url: `/auth/google-login`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
    authVerifyOtp: builder.mutation({
      query: (data) => ({
        url: `/auth/verify-otp`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
    resendVerifyOtp: builder.mutation({
      query: (data) => ({
        url: `/auth/resend-otp`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
    loginUser: builder.mutation({
      query: (data) => ({
        url: `/auth/login`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
    forgetPassword: builder.mutation({
      query: (data) => ({
        url: `/auth/forget-password`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `/auth/reset-password`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
    getMeData: builder.query({
      query: () => ({
        url: `/auth/get-me`,
        method: "GET",
      }),
      providesTags: ["auth"],
    }),
  }),
});

export const {
  useUserSignUpMutation,
  useUserSocialLoginMutation,
  useAuthVerifyOtpMutation,
  useResendVerifyOtpMutation,
  useLoginUserMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useGetMeDataQuery,
  useLazyGetMeDataQuery,
} = authApi;
