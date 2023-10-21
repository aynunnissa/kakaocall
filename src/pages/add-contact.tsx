import { ChangeEvent, useState } from 'react';
import { css } from '@emotion/react';
import { useLazyQuery, useMutation } from '@apollo/client';

import addContact from '@/graphql/mutations/ADD_CONTACT_WITH_PHONES';
import useInput from '@/hooks/use-input';
import { useContact } from '@/store/context/contact-context';
import { Types } from '@/store/action/action';
import { useRouter } from 'next/router';
import Link from 'next/link';
import GET_CONTACT_LIST from '@/graphql/queries/GET_CONTACTS';
import { theme } from '@theme';
import Header from '@/components/layout/Header';
import MainContainer from '@/components/layout/MainContainer';
import Head from 'next/head';

const mainContainerStyle = css({
  display: 'flex',
  justifyContent: 'center',
});

const formContainerStyle = css({
  width: '450px',
  maxWidth: '100%',
  marginTop: theme.spacing.lg,
  padding: `${theme.spacing.md} ${theme.spacing.lg}`,
  borderRadius: theme.shape.rounded.xl,
  boxShadow: theme.shadow.normal,

  [theme.breakpoints.sm]: {
    padding: `${theme.spacing.md} ${theme.spacing.xl}`,
  },
});

const formTitleStyle = css({
  fontSize: theme.text.xl,
  fontWeight: 500,
  color: theme.palette.primary.main,
  textAlign: 'center',
});

const inputField = css({
  padding: `${theme.spacing.md} ${theme.spacing.lg}`,
  outline: 'none',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: theme.palette.grey[100],
  width: '100%',
  margin: '5px 0px',
  boxSizing: 'border-box',
  fontSize: theme.text.md,
});

const errorTextStyle = css({
  color: theme.palette.error.main,
  marginTop: theme.spacing.xs,
  fontSize: theme.text.sm,
});

const submitButtonStyle = css({
  border: 'none',
  width: '100%',
  margin: `${theme.spacing.lg} 0`,
  padding: `${theme.spacing.md}`,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  borderRadius: theme.shape.rounded.lg,
  cursor: 'pointer',
});

/**
 * Regex to validate contact name: should not contains special Characters
 */
const nameValidation = /^[a-zA-Z0-9\s]*$/;

const AddContact = () => {
  const {
    value: enteredName,
    isValid: enteredNameIsValid,
    hasError: nameInputHasError,
    valueChangeHandler: nameChangedHandler,
    inputBlurHandler: nameBlurHandler,
  } = useInput((value: string) => nameValidation.test(value) && value);

  const { state, dispatch } = useContact();
  const router = useRouter();
  const [phoneFields, setPhoneFields] = useState([{ number: '' }]);
  const [formError, setFormError] = useState('');

  const [submitContact] = useMutation(addContact, {
    onCompleted({ insert_contact }) {
      const addedContact = insert_contact?.returning?.[0];
      if (addedContact) {
        dispatch({
          type: Types.Add,
          payload: {
            contact: addedContact,
          },
        });
      }
      router.push('/');
    },
    onError(error) {
      const errorMessage = error.message ?? '';
      if (errorMessage.includes('Uniqueness violation')) {
        setFormError(
          'Another contact with the same phone number already exists'
        );
      }
    },
  });

  /**
   * This query used to check if contact with the same Name already exists
   */
  const [getContactList] = useLazyQuery(GET_CONTACT_LIST);

  const handlePhoneField = (e: ChangeEvent<HTMLInputElement>, ind: number) => {
    let newPhoneFields = [...phoneFields];
    newPhoneFields[ind].number = e.target.value;
    if (e.target.value.length > 0 && !phoneFields[ind + 1]) {
      newPhoneFields = [...newPhoneFields, { number: '' }];
    }
    setPhoneFields(newPhoneFields);
  };

  const formSubmissionHandler = (event: React.FormEvent) => {
    event.preventDefault();

    if (!enteredNameIsValid) {
      return;
    }

    /**
     * Split Name into first_name and last_name
     */
    const arrName = enteredName.split(' ');
    const firstName =
      arrName.length === 1
        ? arrName[0]
        : arrName.slice(0, arrName.length - 1).join(' ');
    const lastName = arrName.length === 1 ? '' : arrName[arrName.length - 1];

    /**
     * This section will check if contact already exists
     * If not, the update will be submitted
     */

    const existingContact = state.contactList.find(contact => {
      const name = `${contact.first_name} ${contact.last_name}`;
      const newContactName = `${firstName} ${lastName}`;
      if (name.toLowerCase().includes(newContactName.toLowerCase())) {
        setFormError('Another contact with the same name already exists');
        return true;
      }
    });

    if (existingContact) return;

    const getExistingContact = getContactList({
      variables: {
        where: {
          first_name: { _ilike: firstName },
          last_name: { _ilike: lastName },
        },
      },
    });
    getExistingContact.then(result => {
      if (result?.data?.contact?.length > 0) {
        setFormError('Another contact with the same name already exists');
      } else {
        submitContact({
          variables: {
            first_name: firstName,
            last_name: lastName,
            phones: phoneFields.filter(phone => phone.number),
          },
        });
      }
    });
  };

  return (
    <>
      <Head>
        <title>Add Contact - Effortlessly Expand Your Contact List</title>
        <meta
          name="description"
          content="Create new contacts and effortlessly organize your connections. Stay connected with ease."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Header />
        <MainContainer>
          <div css={mainContainerStyle}>
            <div css={formContainerStyle}>
              <h2 css={formTitleStyle}>Create Contact</h2>
              <form onSubmit={formSubmissionHandler}>
                <div>
                  <input
                    type="text"
                    id="name"
                    css={inputField}
                    onChange={nameChangedHandler}
                    onBlur={nameBlurHandler}
                    value={enteredName}
                    placeholder="Name"
                  />
                  {nameInputHasError && !enteredName && (
                    <p css={errorTextStyle}>Name must not be empty</p>
                  )}
                  {nameInputHasError && enteredName && (
                    <p css={errorTextStyle}>
                      Name should not contain any special characters.
                    </p>
                  )}
                  {phoneFields.map((field, ind) => {
                    return (
                      <input
                        key={`phoneInput-${ind}`}
                        id={`phoneInput-${ind}`}
                        css={inputField}
                        onChange={e => handlePhoneField(e, ind)}
                        placeholder={`Phone ${ind + 1}`}
                        value={field.number}
                      />
                    );
                  })}
                </div>
                {formError && <p css={errorTextStyle}>{formError}</p>}

                <div>
                  <button css={submitButtonStyle} disabled={!enteredName}>
                    Save Contact
                  </button>
                </div>
              </form>
            </div>
          </div>
        </MainContainer>
      </div>
    </>
  );
};

export default AddContact;
