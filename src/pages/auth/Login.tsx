import { Group, Anchor, PasswordInput, Text, Checkbox, TextInput, LoadingOverlay, Alert } from "@mantine/core"
import { useForm } from "@mantine/form"
import useAuthStore from "../../store/authStore";
import CustomLoader from "../../components/CustomLoader";
import { useNavigate } from "react-router-dom";
import { IconAlertCircle } from "@tabler/icons-react";

const Login = () => {

  const navigate = useNavigate();
  const authStore = useAuthStore();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length > 6 ? null : 'Password must be at least 6 characters long'),
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    const authenticated = await authStore.login(values.email, values.password);
    if (authenticated) {
      navigate('/redirect');
    }
  })


  return (
    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
      <LoadingOverlay loader={CustomLoader} visible={authStore.loading} />
      <Alert
        display={authStore.error != null ? 'block' : 'none'}
        icon={<IconAlertCircle size="2rem" />} title="Authentification Error" color="orange">
        {authStore.error}
      </Alert>
      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
        Sign in to your account
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" >
        <div>
          <TextInput
            withAsterisk
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps('email')}
          />
        </div>
        <div>
          <Group position="apart" mb={5}>
            <Text component="label" htmlFor="your-password" size="sm" weight={500}>
              Your password
            </Text>

            <Anchor<'a'>
              href="#"
              onClick={(event) => event.preventDefault()}
              sx={(theme) => ({
                paddingTop: 2,
                color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6],
                fontWeight: 500,
                fontSize: theme.fontSizes.xs,
              })}
            >
              Forgot your password?
            </Anchor>
          </Group>
          <PasswordInput placeholder="Your password" id="your-password"
            {...form.getInputProps('password', { type: 'input' })}
          />
        </div>
        <Checkbox
          mt="sm"
          label="Remember me"
          {...form.getInputProps('rememberMe', { type: 'checkbox' })}
        />
        <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Sign in</button>
      </form>
    </div>


  )
}

export default Login