<script setup lang="ts">
import { ref, onBeforeMount, defineExpose, defineProps, watch } from 'vue';
import { BootstrapButtonEnum } from '@/types/BootstrapButtonEnum';
import { Etudiant } from '@/domain/entities/Etudiant';
import { Parcours } from '@/domain/entities/Parcours';
import CustomInput from '@/presentation/components/forms/components/CustomInput.vue';
import CustomButton from '@/presentation/components/forms/components/CustomButton.vue';
import CustomModal from '@/presentation/components/modals/CustomModal.vue';

const currentEtudiant = ref<Etudiant>(new Etudiant(null, '', '', null));
const isOpen = ref(false);
const formErrors = ref<{
  Nom: string | null;
  Prenom: string | null;
  Parcours: string | null;
}>({
  Nom: null,
  Prenom: null,
  Parcours: null,
});

// Charger les options des parcours
const parcoursOptions = ref<Parcours[]>([]);

const openForm = (etudiant: Etudiant | null = null) => {
  isOpen.value = true;
  if (etudiant) {
    currentEtudiant.value = etudiant;
  }
};

const closeForm = () => {
  isOpen.value = false;
  currentEtudiant.value = new Etudiant(null, '', '', null);
  formErrors.value = { Nom: null, Prenom: null, Parcours: null };
};

const saveEtudiant = () => {
  // Validation des champs
  if (formErrors.value.Nom || formErrors.value.Prenom || formErrors.value.Parcours) {
    alert('Veuillez corriger les erreurs dans le formulaire.');
    return;
  }

  const storedEtudiants = JSON.parse(localStorage.getItem('etudiants') || '[]');

  if (currentEtudiant.value.ID) {
    // Mise à jour d'un étudiant existant
    const index = storedEtudiants.findIndex(
      (etudiant: Etudiant) => etudiant.ID === currentEtudiant.value.ID
    );
    if (index !== -1) {
      storedEtudiants[index] = { ...currentEtudiant.value };
      localStorage.setItem('etudiants', JSON.stringify(storedEtudiants));
      alert('Étudiant mis à jour avec succès.');
      emit('update:etudiant');
    }
  } else {
    // Création d'un nouvel étudiant
    currentEtudiant.value.ID = Date.now(); // Génération d'un ID unique basé sur le timestamp
    storedEtudiants.push({ ...currentEtudiant.value });
    localStorage.setItem('etudiants', JSON.stringify(storedEtudiants));
    alert('Étudiant créé avec succès.');
    emit('create:etudiant');
  }

  emit('refresh:etudiants'); // Émettre l'événement pour rafraîchir la liste
  closeForm();
};

// Récupérer les parcours à partir du localStorage
const loadParcoursOptions = () => {
  const storedParcours = JSON.parse(localStorage.getItem('parcours') || '[]');
  parcoursOptions.value = storedParcours;
};

const props = defineProps({
  etudiant: {
    type: Object as () => Etudiant | null,
    required: false,
    default: null,
  },
});

const emit = defineEmits(['create:etudiant', 'update:etudiant']);

onBeforeMount(() => {
  if (props.etudiant) {
    currentEtudiant.value = props.etudiant;
  }
  loadParcoursOptions();
});

defineExpose({
  openForm,
  closeForm,
});

// Validation du nom
watch(() => currentEtudiant.value.Nom, () => {
  if (!currentEtudiant.value.Nom || currentEtudiant.value.Nom.trim() === '' || currentEtudiant.value.Nom.length < 2) {
    formErrors.value.Nom = 'Le nom doit faire au moins 2 caractères.';
  } else {
    formErrors.value.Nom = null;
  }
});

// Validation du prénom
watch(() => currentEtudiant.value.Prenom, () => {
  if (!currentEtudiant.value.Prenom || currentEtudiant.value.Prenom.trim() === '' || currentEtudiant.value.Prenom.length < 2) {
    formErrors.value.Prenom = 'Le prénom doit faire au moins 2 caractères.';
  } else {
    formErrors.value.Prenom = null;
  }
});

// Validation du parcours
watch(() => currentEtudiant.value.Parcours, () => {
  if (!currentEtudiant.value.Parcours) {
    formErrors.value.Parcours = 'Veuillez sélectionner un parcours.';
  } else {
    formErrors.value.Parcours = null;
  }
});
</script>

<template>
  <CustomModal :isOpen="isOpen">
    <template v-slot:title>
      <template v-if="etudiant && etudiant.ID"> Modification d'un étudiant </template>
      <template v-else> Nouvel étudiant </template>
    </template>
    <template v-slot:body>
      <div class="text-start mt-1 mb-1">
        <form>
          <!-- Nom -->
          <CustomInput
            v-model="currentEtudiant.Nom"
            class="mt-2"
            id="nom"
            libelle="Nom"
            type="text"
            placeholder="Nom de l'étudiant"
            :error="formErrors.Nom"
          />
          <!-- Prénom -->
          <CustomInput
            v-model="currentEtudiant.Prenom"
            id="prenom"
            libelle="Prénom"
            type="text"
            placeholder="Prénom de l'étudiant"
            :error="formErrors.Prenom"
          />
          <!-- Parcours -->
          <div class="form-group mt-2">
            <label for="parcours">Parcours :</label>
            <v-select
              label="NomParcours"
              v-model="currentEtudiant.Parcours"
              :options="parcoursOptions"
            />
            <div v-if="formErrors.Parcours" class="invalid-feedback">
              {{ formErrors.Parcours }}
            </div>
          </div>
        </form>
      </div>
      <!-- Boutons -->
      <CustomButton class="mt-1" style="margin-left: 5px" :color="BootstrapButtonEnum.danger" @click="closeForm">
        Annuler
      </CustomButton>
      <CustomButton class="mt-1" style="margin-left: 5px" :color="BootstrapButtonEnum.primary" @click="saveEtudiant">
        Enregistrer
      </CustomButton>
    </template>
  </CustomModal>
</template>
