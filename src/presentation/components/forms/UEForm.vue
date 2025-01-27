<script setup lang="ts">
import { ref, onBeforeMount, defineExpose, defineProps, watch } from 'vue';
import { BootstrapButtonEnum } from '@/types/BootstrapButtonEnum';
import { UE } from '@/domain/entities/IUE';
import CustomInput from '@/presentation/components/forms/components/CustomInput.vue';
import CustomButton from '@/presentation/components/forms/components/CustomButton.vue';
import CustomModal from '@/presentation/components/modals/CustomModal.vue';
import type { Parcours } from '@/domain/entities/Parcours';

const currentUe = ref<UE>(new UE(null, null, null, null));
const isOpen = ref(false);
const formErrors = ref<{
  NumeroUe: string | null;
  Intitule: string | null;
  parcours: string | null;
}>({
  NumeroUe: null,
  Intitule: null,
  parcours: null,
});

// Charger les options des parcours
const parcoursOptions = ref<Parcours[]>([]);

const openForm = (ue: UE | null = null) => {
  isOpen.value = true;
  if (ue) {
    currentUe.value = ue;
  }
};

const closeForm = () => {
  isOpen.value = false;
  currentUe.value = new UE(null, null, null, null);
  formErrors.value = { NumeroUe: null, Intitule: null, parcours: null };
};

const saveUE = () => {
  // Validation des champs
  if (formErrors.value.NumeroUe || formErrors.value.Intitule || formErrors.value.parcours) {
    alert('Veuillez corriger les erreurs dans le formulaire.');
    return;
  }

  const storedUEs = JSON.parse(localStorage.getItem('ues') || '[]');

  if (currentUe.value.ID) {
    // Mise à jour d'une UE existante
    const index = storedUEs.findIndex((ue: UE) => ue.ID === currentUe.value.ID);
    if (index !== -1) {
      storedUEs[index] = { ...currentUe.value };
      localStorage.setItem('ues', JSON.stringify(storedUEs));
      alert('UE mise à jour avec succès.');
    }
  } else {
    // Création d'une nouvelle UE
    currentUe.value.ID = Date.now(); // Génération d'un ID unique basé sur le timestamp
    storedUEs.push({ ...currentUe.value });
    localStorage.setItem('ues', JSON.stringify(storedUEs));
    alert('UE créée avec succès.');
  }

  closeForm();
};

// Récupérer les parcours à partir du localStorage
const loadParcoursOptions = () => {
  const storedParcours = JSON.parse(localStorage.getItem('parcours') || '[]');
  parcoursOptions.value = storedParcours;
};

const props = defineProps({
  ue: {
    type: Object as () => UE | null,
    required: false,
    default: null,
  },
});

const emit = defineEmits(['create:ue', 'update:ue']);

onBeforeMount(() => {
  if (props.ue) {
    currentUe.value = props.ue;
  }
  loadParcoursOptions();
});

defineExpose({
  openForm,
  closeForm,
});

// Validation de l'intitulé
watch(() => currentUe.value.Intitule, () => {
  if (!currentUe.value.Intitule || currentUe.value.Intitule.trim() === '' || currentUe.value.Intitule.length < 3) {
    formErrors.value.Intitule = "L'intitulé doit faire au moins 3 caractères.";
  } else {
    formErrors.value.Intitule = null;
  }
});

// Validation du numéro d'UE
watch(() => currentUe.value.NumeroUe, () => {
  if (!currentUe.value.NumeroUe || currentUe.value.NumeroUe.trim() === '' || currentUe.value.NumeroUe.length < 3) {
    formErrors.value.NumeroUe = "Le numéro d'UE doit faire au moins 3 caractères.";
  } else {
    formErrors.value.NumeroUe = null;
  }
});

// Validation du parcours
watch(() => currentUe.value.Parcours, () => {
  if (!currentUe.value.Parcours || currentUe.value.Parcours.length === 0) {
    formErrors.value.parcours = 'Veuillez sélectionner au moins un parcours.';
  } else {
    formErrors.value.parcours = null;
  }
});
</script>

<template>
  <CustomModal :isOpen="isOpen">
    <template v-slot:title>
      <template v-if="ue && ue.ID"> Modification de l'UE</template>
      <template v-else> Nouvelle UE</template>
    </template>
    <template v-slot:body>
      <div class="text-start mt-1 mb-1">
        <form>
          <!-- Numéro d'UE -->
          <CustomInput
            v-model="currentUe.NumeroUe"
            class="mt-2"
            id="numeroue"
            libelle="Numéro"
            type="text"
            placeholder="Numéro d'UE"
            :error="formErrors.NumeroUe"
          />
          <!-- Intitulé de l'UE -->
          <CustomInput
            v-model="currentUe.Intitule"
            id="intitule"
            libelle="Intitulé"
            type="text"
            placeholder="Intitulé de l'UE"
            :error="formErrors.Intitule"
          />
          <!-- Parcours associés -->
          <div class="form-group mt-2">
            <label for="parcours">Parcours :</label>
            <v-select
              multiple
              label="NomParcours"
              v-model="currentUe.Parcours"
              :options="parcoursOptions"
            />
            <div v-if="formErrors.parcours" class="invalid-feedback">
              {{ formErrors.parcours }}
            </div>
          </div>
        </form>
      </div>
      <!-- Boutons -->
      <CustomButton class="mt-1" style="margin-left: 5px" :color="BootstrapButtonEnum.danger" @click="closeForm">
        Annuler
      </CustomButton>
      <CustomButton class="mt-1" style="margin-left: 5px" :color="BootstrapButtonEnum.primary" @click="saveUE">
        Enregistrer
      </CustomButton>
    </template>
  </CustomModal>
</template>
